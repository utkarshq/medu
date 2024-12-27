import { Template } from "../models"

export type AdminTemplateRes = {
  template: Template
}

export type AdminTemplatesListRes = {
  templates: Template[]
  count: number
  offset: number
  limit: number
}

export type AdminTemplateDeleteRes = {
  id: string
  object: "template"
  deleted: boolean
}

export type TemplateAnalytics = {
  products_created: {
    count: number
    timeline: Array<{
      date: string
      count: number
    }>
  }
  total_sales: {
    amount: number
    currency_code: string
    timeline: Array<{
      date: string
      amount: number
    }>
  }
  field_usage: Array<{
    field_name: string
    usage_count: number
    average_value?: number | string
  }>
  variant_distribution: Array<{
    variant_options: Record<string, string>
    count: number
    sales: number
  }>
  price_ranges: Array<{
    range: {
      min: number
      max: number
    }
    count: number
  }>
}

export type BulkOperationResult = {
  affected: number
  failed: Array<{
    id: string
    error: string
  }>
}

export type ValidationResult = {
  valid: boolean
  errors: Array<{
    field: string
    message: string
  }>
  warnings: Array<{
    field: string
    message: string
  }>
} 