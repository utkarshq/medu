import { TemplateStatus } from "@medusajs/framework/types"

export type TemplateFieldValueType = 
  | "string"
  | "number" 
  | "boolean"
  | "enum"
  | "price"
  | "dimensions"
  | "weight"
  | "image"
  | "color"
  | "date"

export type TemplateFieldConfig = {
  field_name: string
  field_type: TemplateFieldType // "static" | "dynamic" | "optional"
  value_type: TemplateFieldValueType
  default_value?: any
  is_required?: boolean
  settings?: {
    min?: number
    max?: number
    options?: string[]  // For enum types
    pattern?: string   // For regex validation
    placeholder?: string
    help_text?: string
    unit?: string      // For dimensions, weight, etc.
    format?: string    // For dates, numbers, etc.
  }
  conditions?: {
    depends_on?: string   // Field name this depends on
    show_when?: any       // Value that triggers showing this field
    required_when?: any   // Value that makes this field required
  }
  validation_rules?: TemplateFieldValidationRule[]
}

export type VariantPricingStrategy = "static" | "option_based" | "dynamic"

export type VariantConfig = {
  options: TemplateOptionConfig[]
  pricing_strategy: VariantPricingStrategy
  base_price?: number
  price_adjustments?: {
    [optionId: string]: {
      values: {
        [value: string]: number
      }
    }
  }
  variant_fields: TemplateFieldConfig[]
}

export type ProductTemplateDTO = {
  // Template metadata
  title: string                // Template name (e.g., "Basic T-Shirt Template")
  description?: string         // Template description
  status: TemplateStatus

  // Required product fields (always dynamic)
  required_fields: {
    title: boolean             // Whether product title is required
    handle?: boolean          // Whether product handle is required
  }
  
  // Product base configuration
  base_fields: TemplateFieldConfig[]
  
  // Variant configuration
  variant_config: VariantConfig
  
  settings?: {
    inventory_management_enabled?: boolean
    tax_inclusive?: boolean
    shipping_required?: boolean
  }
}

export type TemplateOptionConfig = {
  title: string
  values: string[]
  required: boolean
  metadata?: Record<string, unknown>
}

export type TemplateFieldType = "static" | "dynamic" | "optional"

export type CreateTemplateFieldDTO = {
  field_name: string
  field_type: TemplateFieldType
  default_value?: string
  is_required?: boolean
  validation_rules?: TemplateFieldValidationRule[]
  metadata?: Record<string, unknown>
  sort_order?: number
  field_config?: {
    min?: number
    max?: number
    options?: string[]  // For enum fields
    pattern?: string   // For regex validation
    placeholder?: string
    help_text?: string
  }
}

export type UpdateTemplateDTO = Partial<CreateTemplateDTO> & {
  id: string
}

export type TemplateFieldValidationRule = {
  type: "regex" | "min" | "max" | "enum" | "custom"
  value: any
  message: string
}

export interface ITemplateModuleService {
  createTemplate(data: CreateTemplateDTO): Promise<Template>
  updateTemplate(id: string, data: UpdateTemplateDTO): Promise<Template>
  deleteTemplate(id: string): Promise<void>
  listTemplates(filters?: TemplateFilter): Promise<Template[]>
  retrieveTemplate(id: string): Promise<Template>
  validateProductAgainstTemplate(productData: any, templateId: string): Promise<boolean>
}

// Other types... 