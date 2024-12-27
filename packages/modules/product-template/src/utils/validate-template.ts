import { MedusaError } from "@medusajs/utils"
import { CreateTemplateFieldDTO, ValidationRuleDTO } from "../types"

export async function validateTemplateFields(
  fields: CreateTemplateFieldDTO[]
): Promise<void> {
  // Check for duplicate field names
  const fieldNames = new Set<string>()
  fields.forEach(field => {
    if (fieldNames.has(field.field_name)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate field name: ${field.field_name}`
      )
    }
    fieldNames.add(field.field_name)
  })

  // Validate each field's validation rules
  for (const field of fields) {
    if (field.validation_rules) {
      await validateFieldRules(field.validation_rules, field.field_name)
    }
  }
}

async function validateFieldRules(
  rules: ValidationRuleDTO[],
  fieldName: string
): Promise<void> {
  for (const rule of rules) {
    switch (rule.type) {
      case "regex":
        validateRegexRule(rule.value, fieldName)
        break
      case "min":
      case "max":
        validateNumericRule(rule.value, fieldName)
        break
      case "enum":
        validateEnumRule(rule.value, fieldName)
        break
      case "custom":
        await validateCustomRule(rule.value, fieldName)
        break
    }
  }
}

function validateRegexRule(pattern: string, fieldName: string): void {
  try {
    new RegExp(pattern)
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid regex pattern for field "${fieldName}": ${error.message}`
    )
  }
}

function validateNumericRule(value: number, fieldName: string): void {
  if (typeof value !== "number" || isNaN(value)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid numeric value for field "${fieldName}"`
    )
  }
}

function validateEnumRule(values: string[], fieldName: string): void {
  if (!Array.isArray(values) || values.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Enum values for field "${fieldName}" must be a non-empty array`
    )
  }
}

async function validateCustomRule(
  functionString: string,
  fieldName: string
): Promise<void> {
  try {
    // Basic syntax validation
    Function(functionString)
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid custom validation function for field "${fieldName}": ${error.message}`
    )
  }
} 