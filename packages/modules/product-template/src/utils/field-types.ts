import { TemplateFieldType } from "../types"

export const getFieldTypeBadgeVariant = (type: TemplateFieldType) => {
  switch (type) {
    case "static":
      return "default"
    case "dynamic":
      return "primary"
    case "optional":
      return "secondary"
  }
}

export const validateFieldByType = (
  fieldType: TemplateFieldType,
  value: any,
  defaultValue?: any
): { valid: boolean; message?: string } => {
  switch (fieldType) {
    case "static":
      return {
        valid: value === defaultValue,
        message: value !== defaultValue ? 
          "Static field values cannot be modified" : undefined
      }
    case "dynamic":
      return {
        valid: value !== undefined && value !== null,
        message: value === undefined || value === null ? 
          "Dynamic field requires a value" : undefined
      }
    case "optional":
      return { valid: true }
  }
} 