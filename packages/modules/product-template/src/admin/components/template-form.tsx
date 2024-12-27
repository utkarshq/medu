import React from "react"
import { Input, TextArea, Switch } from "@medusajs/ui"
import { useTemplateFields } from "../hooks/use-template-fields"

const TemplateForm = ({ templateId, onChange }) => {
  const { fields, isLoading } = useTemplateFields(templateId)

  const renderField = (field) => {
    switch (field.field_type) {
      case "static":
        return (
          <Input
            key={field.id}
            label={field.field_name}
            defaultValue={field.default_value}
            disabled
          />
        )
      case "dynamic":
        return (
          <Input
            key={field.id}
            label={field.field_name}
            required={field.is_required}
            onChange={(e) => 
              onChange(field.field_name, e.target.value)
            }
          />
        )
      case "optional":
        return (
          <Input
            key={field.id}
            label={field.field_name}
            defaultValue={field.default_value}
            onChange={(e) => 
              onChange(field.field_name, e.target.value)
            }
          />
        )
      default:
        return null
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {fields?.map(renderField)}
    </div>
  )
}

export default TemplateForm 