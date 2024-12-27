import React from "react"
import { useFormContext } from "react-hook-form"
import TemplateSelector from "./template-selector"
import TemplateForm from "./template-form"

const ProductTemplateSection = () => {
  const { watch, setValue } = useFormContext()
  const selectedTemplateId = watch("template_id")

  const handleTemplateSelect = (templateId) => {
    setValue("template_id", templateId)
  }

  const handleFieldChange = (fieldName, value) => {
    setValue(fieldName, value)
  }

  return (
    <div className="card p-4">
      <h2 className="text-lg font-medium mb-4">Product Template</h2>
      
      <TemplateSelector onSelect={handleTemplateSelect} />
      
      {selectedTemplateId && (
        <TemplateForm 
          templateId={selectedTemplateId}
          onChange={handleFieldChange}
        />
      )}
    </div>
  )
}

export default ProductTemplateSection 