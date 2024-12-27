import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"
import { Template, TemplateField } from "../models"
import { CreateTemplateDTO, CreateTemplateFieldDTO } from "../types"
import { MedusaError } from "@medusajs/utils"
import { buildQuery } from "../utils/build-query"
import { validateTemplateFields } from "../utils/validate-template"
import { InjectTransactionManager } from "@medusajs/medusa"
import { MedusaContext } from "@medusajs/medusa"
import { ProductModuleService } from "@medusajs/product"
import { Product } from "@medusajs/product/src/models"

class TemplateService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected cacheService_: any
  protected eventBus_: any
  protected readonly productService_: ProductModuleService

  constructor(container) {
    super(container)
    this.cacheService_ = container.cacheService
    this.eventBus_ = container.eventBusService
    this.productService_ = container.productModuleService
  }

  @InjectTransactionManager()
  async create(
    data: CreateTemplateDTO,
    @MedusaContext() context = {}
  ): Promise<Template> {
    return await this.atomicPhase_(async (manager) => {
      const template = await this.createTemplate(data, manager)
      const fields = await this.createFields(template.id, data.fields, manager)
      
      return {
        ...template,
        fields
      }
    }, context)
  }

  private async validateUniqueTitle(title: string): Promise<void> {
    const templateRepo = this.manager_.getRepository(Template)
    const existing = await templateRepo.findOne({
      where: { title }
    })

    if (existing) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `A template with the title "${title}" already exists`
      )
    }
  }

  private async createTemplateFields(
    templateId: string,
    fields: CreateTemplateFieldDTO[],
    manager: EntityManager
  ): Promise<TemplateField[]> {
    const fieldRepo = manager.getRepository(TemplateField)
    
    try {
      // Sort fields by sort_order if provided
      const sortedFields = fields.sort((a, b) => 
        (a.sort_order || 0) - (b.sort_order || 0)
      )

      const createdFields = sortedFields.map((field, index) => 
        fieldRepo.create({
          template_id: templateId,
          sort_order: field.sort_order ?? index,
          ...field
        })
      )

      return await fieldRepo.save(createdFields)
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        "Failed to create template fields: " + error.message
      )
    }
  }

  async validateTemplateFields(fields: CreateTemplateFieldDTO[]): Promise<void> {
    const errors = []

    // Validate field names are unique
    const fieldNames = new Set()
    for (const field of fields) {
      if (fieldNames.has(field.field_name)) {
        errors.push({
          field: field.field_name,
          message: "Duplicate field name"
        })
      }
      fieldNames.add(field.field_name)

      // Validate static fields have default values
      if (field.field_type === "static" && !field.default_value) {
        errors.push({
          field: field.field_name,
          message: "Static fields must have a default value"
        })
      }
    }

    if (errors.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Template field validation failed",
        errors
      )
    }
  }

  async validateUniqueTitle(title: string): Promise<void> {
    // Title uniqueness check
  }

  async validateProductData(template: Template, productData: any) {
    const errors = []

    for (const field of template.fields) {
      const value = productData[field.field_name]
      
      if (field.field_type === "static" && value !== field.default_value) {
        errors.push({
          field: field.field_name,
          message: "Static field cannot be modified"
        })
      }

      if (field.field_type === "dynamic" && !value && field.is_required) {
        errors.push({
          field: field.field_name,
          message: "Required field missing"
        })
      }
    }

    if (errors.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Product data validation failed",
        errors
      )
    }

    return productData
  }

  async getTemplateUsage(templateId: string): Promise<{
    product_count: number;
    products: Product[];
  }> {
    const products = await this.productService_.list(
      { template_id: templateId },
      { select: ["id", "title", "created_at"] }
    )

    return {
      product_count: products.length,
      products
    }
  }

  async validateTemplateUpdate(
    template: Template,
    updates: UpdateTemplateDTO
  ): Promise<void> {
    // Don't allow field removal if template is in use
    if (updates.fields) {
      const usage = await this.getTemplateUsage(template.id)
      if (usage.product_count > 0) {
        const removedFields = template.fields.filter(
          f => !updates.fields.find(uf => uf.id === f.id)
        )
        
        if (removedFields.length) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Cannot remove fields from template with existing products"
          )
        }
      }
    }
  }
}

export default TemplateService 