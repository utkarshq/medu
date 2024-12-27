import React from "react"
import { 
  Card,
  Select,
  Input,
  NumberInput,
  Switch,
  ColorInput,
  DatePicker
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"
import { TemplateFieldValueType } from "../../types"
import { PriceFieldManager } from "./field-types/price-field"

const FieldTypeComponents = {
  string: Input,
  number: NumberInput,
  boolean: Switch,
  price: NumberInput,
  color: ColorInput,
  date: DatePicker,
  // Add other field type components
}

const FieldTypeConfig = {
  string: {
    label: "Text",
    settings: ["pattern", "placeholder", "min", "max"]
  },
  number: {
    label: "Number",
    settings: ["min", "max", "step", "unit"]
  },
  price: {
    label: "Price",
    settings: ["min", "currency"]
  },
  enum: {
    label: "Selection",
    settings: ["options", "multiple"]
  },
  dimensions: {
    label: "Dimensions",
    settings: ["unit"]
  },
  // Add other field type configurations
}

export const TemplateFieldTypeManager = ({ 
  fieldPath,
  valueType,
  fieldType 
}: {
  fieldPath: string
  valueType: TemplateFieldValueType
  fieldType: "static" | "dynamic" | "optional"
}) => {
  const { register, watch, setValue } = useFormContext()
  const value = watch(fieldPath)
  const Component = FieldTypeComponents[valueType]
  
  if (!Component) return null

  const renderFieldSettings = () => {
    const settings = FieldTypeConfig[valueType]?.settings || []
    
    return settings.map(setting => (
      <div key={setting}>
        {renderSettingInput(setting, `${fieldPath}.settings.${setting}`)}
      </div>
    ))
  }

  const renderFieldByType = () => {
    switch (valueType) {
      case "price":
        return (
          <PriceFieldManager 
            fieldPath={fieldPath}
            fieldType={fieldType}
          />
        )
      // ... other field types
    }
  }

  return (
    <Card>
      <Card.Content>
        <Component
          label={fieldType === "static" ? "Default Value" : "Placeholder"}
          {...register(fieldPath)}
          disabled={fieldType === "dynamic"}
          required={fieldType === "static"}
        />
        
        {fieldType !== "dynamic" && renderFieldSettings()}
        
        {valueType === "enum" && (
          <EnumValuesManager
            path={`${fieldPath}.settings.options`}
          />
        )}
      </Card.Content>
    </Card>
  )
} 