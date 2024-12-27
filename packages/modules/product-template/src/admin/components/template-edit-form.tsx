import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Button, 
  FocusModal, 
  Input, 
  TextArea,
  Select,
  useNotification 
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Template } from "../../models"
import { templateSchema } from "../validation/template"
import TemplateFieldManager from "./template-field-manager"

interface Props {
  template: Template
  onClose: () => void
}

const TemplateEditForm = ({ template, onClose }: Props) => {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const methods = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: template.title,
      description: template.description,
      status: template.status,
      is_overridable: template.is_overridable,
      fields: template.fields || [],
    },
  })

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = await fetch(`/admin/templates/${template.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update template")
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["template", template.id])
        notification("Success", "Template updated successfully", "success")
        onClose()
      },
      onError: (error) => {
        notification("Error", error.message, "error")
      },
    }
  )

  return (
    <FocusModal>
      <FocusModal.Header>
        <h1>Edit Template</h1>
      </FocusModal.Header>
      
      <FocusModal.Main>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(mutate)} className="p-6">
            <div className="grid gap-6">
              <div>
                <Input
                  label="Title"
                  required
                  {...methods.register("title")}
                  error={methods.formState.errors.title?.message}
                />
              </div>

              <div>
                <TextArea
                  label="Description"
                  rows={3}
                  {...methods.register("description")}
                  error={methods.formState.errors.description?.message}
                />
              </div>

              <div>
                <Select
                  label="Status"
                  {...methods.register("status")}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="deprecated">Deprecated</option>
                </Select>
              </div>

              <div className="border rounded-lg p-4">
                <TemplateFieldManager />
              </div>
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
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default TemplateEditForm 