import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Button, 
  FocusModal,
  Input,
  Select,
  Switch,
  useNotification 
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { templateFieldSchema } from "../validation/template"
import ValidationRulesManager from "./validation-rules-manager"

interface Props {
  templateId: string
  field?: any
  onClose: () => void
}

const TemplateFieldEditForm = ({ templateId, field, onClose }: Props) => {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const methods = useForm({
    resolver: zodResolver(templateFieldSchema),
    defaultValues: field || {
      field_name: "",
      field_type: "dynamic",
      is_required: false,
      validation_rules: []
    }
  })

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const url = field 
        ? `/admin/templates/${templateId}/fields/${field.id}`
        : `/admin/templates/${templateId}/fields`
      
      const response = await fetch(url, {
        method: field ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error("Failed to save field")
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["template", templateId])
        notification("Success", "Field saved successfully", "success")
        onClose()
      },
      onError: (error) => {
        notification("Error", error.message, "error")
      }
    }
  )

  return (
    <FocusModal>
      <FocusModal.Header>
        <h1>{field ? "Edit Field" : "Add Field"}</h1>
      </FocusModal.Header>
      
      <FocusModal.Main>
        <form onSubmit={methods.handleSubmit(mutate)} className="p-6">
          <div className="grid gap-6">
            <Input
              label="Field Name"
              required
              {...methods.register("field_name")}
              error={methods.formState.errors.field_name?.message}
            />

            <Select
              label="Field Type"
              {...methods.register("field_type")}
            >
              <option value="static">Static</option>
              <option value="dynamic">Dynamic</option>
              <option value="optional">Optional</option>
            </Select>

            <Switch
              label="Required Field"
              {...methods.register("is_required")}
            />

            <ValidationRulesManager fieldIndex={0} />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              Save Field
            </Button>
          </div>
        </form>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default TemplateFieldEditForm 