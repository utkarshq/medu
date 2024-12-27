import React from "react"
import { 
  Button, 
  Select, 
  Input,
  IconButton,
  Tooltip
} from "@medusajs/ui"
import { useFieldArray, useFormContext } from "react-hook-form"
import { PlusIcon, TrashIcon, InfoIcon } from "@medusajs/icons"

type ValidationRuleType = "regex" | "min" | "max" | "enum" | "custom"

interface ValidationRuleConfig {
  type: ValidationRuleType
  label: string
  tooltip: string
  valueType: "text" | "number" | "array"
  placeholder: string
}

const VALIDATION_RULES: Record<ValidationRuleType, ValidationRuleConfig> = {
  regex: {
    type: "regex",
    label: "Regular Expression",
    tooltip: "Validate using a regular expression pattern",
    valueType: "text",
    placeholder: "^[A-Za-z]+$"
  },
  min: {
    type: "min",
    label: "Minimum Value",
    tooltip: "Set minimum numeric value",
    valueType: "number",
    placeholder: "0"
  },
  max: {
    type: "max",
    label: "Maximum Value",
    tooltip: "Set maximum numeric value",
    valueType: "number",
    placeholder: "100"
  },
  enum: {
    type: "enum",
    label: "Enumeration",
    tooltip: "Comma-separated list of allowed values",
    valueType: "array",
    placeholder: "small,medium,large"
  },
  custom: {
    type: "custom",
    label: "Custom Validation",
    tooltip: "Custom validation function (advanced)",
    valueType: "text",
    placeholder: "Enter custom validation logic"
  }
}

const ValidationRulesManager = ({ fieldIndex }: { fieldIndex: number }) => {
  const { control, register, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.validation_rules`
  })

  const addRule = () => {
    append({
      type: "regex",
      value: "",
      message: ""
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Validation Rules</h4>
          <Tooltip content="Add validation rules to ensure data quality">
            <InfoIcon className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={addRule}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((rule, ruleIndex) => {
          const ruleType = watch(`fields.${fieldIndex}.validation_rules.${ruleIndex}.type`) as ValidationRuleType
          const config = VALIDATION_RULES[ruleType]

          return (
            <div key={rule.id} className="grid grid-cols-[120px_1fr_1fr_40px] gap-2 items-start">
              <Select
                size="small"
                {...register(`fields.${fieldIndex}.validation_rules.${ruleIndex}.type`)}
              >
                {Object.entries(VALIDATION_RULES).map(([key, rule]) => (
                  <option key={key} value={key}>{rule.label}</option>
                ))}
              </Select>

              <Input
                size="small"
                placeholder={config.placeholder}
                {...register(`fields.${fieldIndex}.validation_rules.${ruleIndex}.value`)}
                type={config.valueType === "number" ? "number" : "text"}
              />

              <Input
                size="small"
                placeholder="Error message"
                {...register(`fields.${fieldIndex}.validation_rules.${ruleIndex}.message`)}
              />

              <IconButton
                variant="danger"
                size="small"
                onClick={() => remove(ruleIndex)}
              >
                <TrashIcon className="w-4 h-4" />
              </IconButton>
            </div>
          )
        })}

        {fields.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-2 border border-dashed rounded">
            No validation rules added
          </div>
        )}
      </div>
    </div>
  )
}

export default ValidationRulesManager 