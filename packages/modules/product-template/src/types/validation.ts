export type ValidationRuleType = 
  | "required"
  | "regex"
  | "min"
  | "max"
  | "length"
  | "enum"
  | "custom"
  | "dependent"
  | "format"
  | "unique"

export type ValidationRule = {
  type: ValidationRuleType
  value: any
  message: string
  errorLevel?: "error" | "warning"
  condition?: {
    field: string
    operator: "equals" | "not_equals" | "contains" | "not_contains"
    value: any
  }
}

export type FieldValidationConfig = {
  rules: ValidationRule[]
  customValidator?: string // JS function as string
  asyncValidator?: string // Async validation function
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export type ValidationContext = {
  templateId: string
  productData: any
  strict?: boolean
  context?: "create" | "update"
} 