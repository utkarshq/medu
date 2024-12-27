import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Select } from "@medusajs/ui"

const TemplateSelector = ({ onSelect }) => {
  const { data: templates, isLoading } = useQuery(
    ["templates"],
    async () => {
      const response = await fetch("/admin/templates")
      return response.json()
    }
  )

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Template
      </label>
      <Select
        disabled={isLoading}
        placeholder="Select a template..."
        onChange={(value) => onSelect(value)}
      >
        {templates?.map((template) => (
          <Select.Option key={template.id} value={template.id}>
            {template.title}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default TemplateSelector 