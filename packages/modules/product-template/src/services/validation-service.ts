import { MedusaError } from "@medusajs/utils"
import { 
  ValidationRule, 
  ValidationContext,
  ValidationResult 
} from "../types/validation"

export class ValidationService {
  constructor(
    private readonly templateService,
    private readonly productService
  ) {}

  async validateField(
    fieldName: string,
    value: any,
    rules: ValidationRule[],
    context: ValidationContext
  ): Promise<ValidationResult> {
    const errors = []
    const warnings = []

    for (const rule of rules) {
      try {
        const isValid = await this.evaluateRule(rule, value, context)
        
        if (!isValid) {
          const issue = {
            field: fieldName,
            message: rule.message
          }
          
          rule.errorLevel === "warning" 
            ? warnings.push(issue)
            : errors.push(issue)
        }
      } catch (error) {
        errors.push({
          field: fieldName,
          message: `Validation error: ${error.message}`
        })
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  private async evaluateRule(
    rule: ValidationRule,
    value: any,
    context: ValidationContext
  ): Promise<boolean> {
    // Check conditions first
    if (rule.condition) {
      const conditionMet = this.evaluateCondition(
        rule.condition,
        context.productData
      )
      if (!conditionMet) return true
    }

    switch (rule.type) {
      case "required":
        return value !== undefined && value !== null && value !== ""

      case "regex":
        return new RegExp(rule.value).test(String(value))

      case "min":
        return typeof value === "number" && value >= rule.value

      case "max":
        return typeof value === "number" && value <= rule.value

      case "length":
        return String(value).length === rule.value

      case "enum":
        return Array.isArray(rule.value) && rule.value.includes(value)

      case "format":
        return this.validateFormat(value, rule.value)

      case "unique":
        return await this.validateUnique(value, context)

      case "custom":
        return this.evaluateCustomRule(rule.value, value, context)

      default:
        throw new Error(`Unknown validation rule type: ${rule.type}`)
    }
  }

  private evaluateCondition(
    condition: ValidationRule["condition"],
    data: any
  ): boolean {
    const fieldValue = data[condition.field]

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value
      case "not_equals":
        return fieldValue !== condition.value
      case "contains":
        return Array.isArray(fieldValue) && 
          fieldValue.includes(condition.value)
      case "not_contains":
        return Array.isArray(fieldValue) && 
          !fieldValue.includes(condition.value)
      default:
        return false
    }
  }

  private validateFormat(value: any, format: string): boolean {
    const formats = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      url: /^https?:\/\/.+/,
      slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      color: /^#[0-9a-f]{6}$/i,
      // Add more formats as needed
    }

    return formats[format]?.test(String(value)) ?? false
  }

  private async validateUnique(
    value: any,
    context: ValidationContext
  ): Promise<boolean> {
    const existing = await this.productService.findOne({
      where: { [context.field]: value },
      select: ["id"]
    })

    return !existing
  }

  private evaluateCustomRule(
    ruleFunction: string,
    value: any,
    context: ValidationContext
  ): boolean {
    try {
      // SECURITY: This needs proper sandboxing in production
      const fn = new Function("value", "context", ruleFunction)
      return fn(value, context)
    } catch (error) {
      throw new Error(`Custom validation error: ${error.message}`)
    }
  }
} 