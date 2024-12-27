import React from "react"
import { 
  Button, 
  Input, 
  Select, 
  Switch,
  Accordion,
  IconButton,
  Tooltip,
  Badge,
  Card
} from "@medusajs/ui"
import { useFieldArray, useFormContext } from "react-hook-form"
import { PlusIcon, TrashIcon, InfoIcon } from "@medusajs/icons"
import { TemplateFieldType } from "../../types"
import ValidationRulesManager from "./validation-rules-manager"
import { TemplateFieldTypeManager } from "./template-field-type-manager"

const FieldTypeConfig = {
  static: {
    label: "Static",
    description: "Value is set during template creation and cannot be changed during product creation",
    icon: "LockIcon",
    requiresDefault: true
  },
  dynamic: {
    label: "Dynamic",
    description: "Value must be set during product creation",
    icon: "EditIcon",
    requiresDefault: false
  },
  optional: {
    label: "Optional",
    description: "Value can be set during product creation, with an optional default",
    icon: "OptionalIcon",
    requiresDefault: false
  }
}

const TemplateFieldManager = ({ fieldArrayName = "base_fields" }) => {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName
  })

  const handleAddField = () => {
    append({
      field_name: "",
      field_type: "dynamic",
      value_type: "string",
      is_required: false,
      settings: {}
    })
  }

  const renderFieldCard = (field, index) => {
    const fieldType = watch(`${fieldArrayName}.${index}.field_type`)
    const valueType = watch(`${fieldArrayName}.${index}.value_type`)

    return (
      <Card key={field.id}>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Input
              {...register(`${fieldArrayName}.${index}.field_name`)}
              placeholder="Field Name"
            />
            <div className="flex gap-x-2">
              <Select
                value={fieldType}
                onChange={(value) => setValue(`${fieldArrayName}.${index}.field_type`, value)}
              >
                <Select.Option value="static">
                  Static (Preset)
                </Select.Option>
                <Select.Option value="dynamic">
                  Dynamic (Required)
                </Select.Option>
                <Select.Option value="optional">
                  Optional
                </Select.Option>
              </Select>
              
              <Select
                value={valueType}
                onChange={(value) => setValue(`${fieldArrayName}.${index}.value_type`, value)}
              >
                <Select.Option value="string">Text</Select.Option>
                <Select.Option value="number">Number</Select.Option>
                <Select.Option value="price">Price</Select.Option>
                <Select.Option value="enum">Selection</Select.Option>
                {/* Add other value types */}
              </Select>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <TemplateFieldTypeManager
            fieldPath={`${fieldArrayName}.${index}`}
            fieldType={fieldType}
            valueType={valueType}
          />
        </Card.Content>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => renderFieldCard(field, index))}
      <Button onClick={handleAddField}>Add Field</Button>
    </div>
  )
}

export default TemplateFieldManager 