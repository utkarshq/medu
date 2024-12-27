import React from "react"
import { 
  Card,
  Button,
  Select,
  Input,
  Switch,
  IconButton
} from "@medusajs/ui"
import { useFieldArray, useFormContext } from "react-hook-form"
import { ValidationRuleType } from "../../types/validation"

const RULE_TYPES: Record<ValidationRuleType, {
  label: string
  valueType: "text" | "number" | "boolean" | "array" | "function"
  hasMessage: boolean
  hasCondition: boolean
}> = {
  required: {
    label: "Required",
    valueType: "boolean",
    hasMessage: true,
    hasCondition: true
  },
  regex: {
    label: "Regular Expression",
    valueType: "text",
    hasMessage: true,
    hasCondition: false
  },
  min: {
    label: "Minimum Value",
    valueType: "number",
    hasMessage: true,
    hasCondition: false
  },
  max: {
    label: "Maximum Value",
    valueType: "number",
    hasMessage: true,
    hasCondition: false
  },
  // ... other rule types
}

export const ValidationRuleBuilder = ({ 
  fieldPath 
}: { 
  fieldPath: string 
}) => {
  const { control, register, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPath}.validation.rules`
  })

  const addRule = () => {
    append({
      type: "required",
      value: true,
      message: "",
      errorLevel: "error"
    })
  }

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Validation Rules</h3>
        <Button
          variant="secondary"
          size="small"
          onClick={addRule}
        >
          Add Rule
        </Button>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {fields.map((field, index) => {
            const ruleType = watch(
              `${fieldPath}.validation.rules.${index}.type`
            ) as ValidationRuleType
            const ruleConfig = RULE_TYPES[ruleType]

            return (
              <div 
                key={field.id}
                className="border rounded p-4 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Select
                    {...register(
                      `${fieldPath}.validation.rules.${index}.type`
                    )}
                  >
                    {Object.entries(RULE_TYPES).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    {...register(
                      `${fieldPath}.validation.rules.${index}.errorLevel`
                    )}
                  >
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                  </Select>

                  <IconButton
                    variant="danger"
                    size="small"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </IconButton>
                </div>

                {ruleConfig.valueType !== "boolean" && (
                  <Input
                    label="Value"
                    type={ruleConfig.valueType === "number" ? "number" : "text"}
                    {...register(
                      `${fieldPath}.validation.rules.${index}.value`
                    )}
                  />
                )}

                {ruleConfig.hasMessage && (
                  <Input
                    label="Error Message"
                    {...register(
                      `${fieldPath}.validation.rules.${index}.message`
                    )}
                  />
                )}

                {ruleConfig.hasCondition && (
                  <Card>
                    <Card.Header>
                      <h4 className="text-sm font-medium">Condition</h4>
                    </Card.Header>
                    <Card.Content>
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Field"
                          {...register(
                            `${fieldPath}.validation.rules.${index}.condition.field`
                          )}
                        />
                        <Select
                          label="Operator"
                          {...register(
                            `${fieldPath}.validation.rules.${index}.condition.operator`
                          )}
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="contains">Contains</option>
                          <option value="not_contains">Not Contains</option>
                        </Select>
                        <Input
                          label="Value"
                          {...register(
                            `${fieldPath}.validation.rules.${index}.condition.value`
                          )}
                        />
                      </div>
                    </Card.Content>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      </Card.Content>
    </Card>
  )
} 