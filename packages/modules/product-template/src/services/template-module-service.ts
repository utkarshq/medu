import { 
    MedusaService, 
    InjectManager,
    MedusaContext,
    MedusaError,
    InjectTransactionManager
  } from "@medusajs/framework/utils"
  import { Template, TemplateField } from "../models"
  import { CreateTemplateDTO, UpdateTemplateDTO, TemplateFieldValidationRule } from "../types"
  import { EventBusService } from "@medusajs/framework/types"
  import { TemplateService } from "./template-service"
  import { ProductModuleService } from "./product-module-service"
  import { 
    IProductModuleService,
    ProductTypes 
  } from "@medusajs/framework/types"
  
  type InjectedDependencies = {
    eventBusService: EventBusService
    templateService: TemplateService
    productModuleService: IProductModuleService
  }
  
  export enum TemplateEvents {
    CREATED = "template.created",
    UPDATED = "template.updated",
    DELETED = "template.deleted",
    PRODUCT_CREATED = "template.product.created"
  }
  
  class TemplateModuleService extends MedusaService({
    Template,
    TemplateField,
  }) {
    protected readonly eventBus_: EventBusService
    protected readonly templateService_: TemplateService
    protected readonly productService_: ProductModuleService
  
    constructor({ 
      eventBusService,
      templateService,
      productModuleService 
    }) {
      super(...arguments)
      this.eventBus_ = eventBusService
      this.templateService_ = templateService
      this.productService_ = productModuleService
    }
  
    private async emitTemplateEvent(
      eventType: TemplateEvents,
      data: Record<string, unknown>
    ) {
      await this.eventBus_.emit(eventType, {
        id: data.id,
        ...data
      })
    }
  
    async createTemplate(data: CreateTemplateDTO) {
      const template = await this.templateService_.create(data)
      
      await this.emitTemplateEvent(TemplateEvents.CREATED, {
        id: template.id,
        template
      })

      return template
    }
  
    @InjectTransactionManager()
    async updateTemplate(
      id: string, 
      updates: UpdateTemplateDTO,
      @MedusaContext() context = {}
    ) {
      const template = await this.templateService_.findOne(
        { id, relations: ["fields"] },
        context
      )
  
      if (!template) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Template with id ${id} not found`
        )
      }
  
      // Determine if a new version is needed
      const needsNewVersion = this.needsNewVersion(template, updates)
  
      if (needsNewVersion) {
        // Archive the current version
        await this.templateService_.update(
          { id: template.id },
          { status: "deprecated" },
          context
        )
  
        // Create a new version of the template
        const newTemplate = await this.templateService_.create(
          {
            ...template,
            ...updates,
            id: undefined, // Let the DB generate a new ID
            version: template.version + 1,
            fields: updates.fields?.map((field) => ({
              ...field,
              id: undefined,
              sort_order: field.sort_order ?? 0,
            })),
          },
          context
        )
  
        await this.eventBus_.emit("template.versioned", {
          id: newTemplate.id,
          previousVersion: template.version,
          newVersion: newTemplate.version,
        })
  
        return newTemplate
      }
  
      // Update the existing template for minor changes
      const updated = await this.templateService_.update(
        { id },
        updates,
        context
      )
  
      await this.eventBus_.emit("template.updated", {
        id: updated.id,
        version: updated.version,
      })
  
      return updated
    }
  
    @InjectManager()
    async validateFieldValue(
      fieldName: string,
      value: any,
      rules: TemplateFieldValidationRule[]
    ): Promise<boolean> {
      for (const rule of rules) {
        switch (rule.type) {
          case "regex":
            const regex = new RegExp(rule.value)
            if (!regex.test(String(value))) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                rule.message || `${fieldName} does not match required pattern`
              )
            }
            break
  
          case "min":
            if (typeof value === "number" && value < rule.value) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                rule.message || `${fieldName} must be at least ${rule.value}`
              )
            }
            break
  
          case "max":
            if (typeof value === "number" && value > rule.value) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                rule.message || `${fieldName} must be at most ${rule.value}`
              )
            }
            break
  
          case "enum":
            if (!Array.isArray(rule.value) || !rule.value.includes(value)) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                rule.message || `${fieldName} must be one of: ${rule.value.join(", ")}`
              )
            }
            break
        }
      }
      return true
    }
  
    private needsNewVersion(template: Template, updates: UpdateTemplateDTO): boolean {
      // Check if fields are modified
      if (updates.fields) {
        return true
      }
  
      // Check if any other significant property is modified
      const excludedProps = ["id", "metadata", "created_at", "updated_at"] // Exclude non-critical properties
      for (const key in updates) {
        if (
          updates.hasOwnProperty(key) &&
          !excludedProps.includes(key) &&
          updates[key] !== template[key]
        ) {
          return true
        }
      }
  
      return false
    }
  
    async createProductFromTemplate(
      templateId: string,
      productData: CreateProductDTO
    ): Promise<Product> {
      const template = await this.templateService_.retrieve(templateId)
      
      // Validate base product data
      const validatedProductData = await this.validateProductData(
        template,
        productData
      )

      // Generate variants based on template options
      const variants = await this.generateVariants(
        template.variant_config,
        productData.variants || []
      )

      // Create product with all necessary data
      const product = await this.productService_.create({
        ...validatedProductData,
        template_id: template.id,
        template_data: this.extractTemplateData(template, validatedProductData),
        options: template.variant_config.options,
        variants: variants,
        // Copy template settings
        ...this.extractTemplateSettings(template)
      })

      await this.eventBus_.emit(TemplateEvents.PRODUCT_CREATED, {
        product_id: product.id,
        template_id: template.id
      })

      return product
    }
  
    private calculateVariantPrice(
      baseConfig: TemplateVariantConfig,
      combination: Record<string, string>
    ): number | undefined {
      const { pricing_strategy } = baseConfig

      switch (pricing_strategy.type) {
        case "static":
          return pricing_strategy.base_price

        case "option_based":
          let price = pricing_strategy.base_price || 0

          // Apply adjustments for each option
          for (const adjustment of pricing_strategy.option_adjustments || []) {
            const optionValue = combination[adjustment.option_id]
            if (optionValue && adjustment.value_adjustments[optionValue]) {
              price += adjustment.value_adjustments[optionValue]
            }
          }

          return price

        case "dynamic":
          return undefined // Will be set during product creation
      }
    }
  
    private async generateVariants(
      variantConfig: TemplateVariantConfig,
      providedVariants: any[]
    ): Promise<ProductVariant[]> {
      const combinations = this.generateOptionCombinations(
        variantConfig.options
      )

      return combinations.map(combination => {
        const variantData = providedVariants.find(v => 
          this.matchesOptionCombination(v, combination)
        ) || {}

        const calculatedPrice = this.calculateVariantPrice(
          variantConfig,
          combination
        )

        return {
          ...this.getDefaultVariantData(variantConfig, combination),
          ...variantData,
          options: combination,
          // Only set price if it's static or option-based
          ...(calculatedPrice !== undefined && { price: calculatedPrice })
        }
      })
    }
  
    private getDefaultVariantData(
      config: TemplateVariantConfig,
      combination: Record<string, string>
    ) {
      const defaults = {}
      
      for (const field of config.variant_fields) {
        if (this.shouldApplyField(field, combination)) {
          defaults[field.field_name] = field.default_value
        }
      }

      return defaults
    }
  
    private extractTemplateData(template: Template, productData: any): Record<string, any> {
      const templateData = {}
      
      for (const field of template.fields) {
        if (productData[field.field_name] !== undefined) {
          templateData[field.field_name] = productData[field.field_name]
        } else if (field.default_value) {
          templateData[field.field_name] = field.default_value
        }
      }

      return templateData
    }
  
    async assignTemplateToCategory(templateId: string, categoryId: string) {
      const template = await this.templateService_.retrieve(templateId)
      const category = await this.productService_.retrieveProductCategory(categoryId)
      
      // Add template reference to category metadata
      await this.productService_.updateProductCategory(categoryId, {
        metadata: {
          ...category.metadata,
          template_id: templateId
        }
      })

      return { template, category }
    }
  }
  
  export default TemplateModuleService
  