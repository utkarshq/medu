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
import { CreateTemplateDTO } from "../../types"
import { templateSchema } from "../validation/template"
import TemplateFieldManager from "./template-field-manager"

interface Props {
  onClose: () => void
}

const TemplateCreateForm = ({ onClose }: Props) => {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const methods = useForm<CreateTemplateDTO>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      is_overridable: false,
      fields: []
    }
  })

  const { mutate, isLoading } = useMutation(
    async (data: CreateTemplateDTO) => {
      const response = await fetch("/admin/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"])
        notification("Success", "Template created successfully", "success")
        onClose()
      },
      onError: (error: Error) => {
        notification("Error", error.message, "error")
      }
    }
  )

  return (
    <FocusModal>
      <FocusModal.Header>
        <h1>Create New Template</h1>
      </FocusModal.Header>
      
      <FocusModal.Main>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(mutate)} className="p-6">
            <div className="grid gap-6">
              <Input
                label="Title"
                required
                {...methods.register("title")}
                error={methods.formState.errors.title?.message}
              />
              
              <TextArea
                label="Description"
                rows={3}
                {...methods.register("description")}
                error={methods.formState.errors.description?.message}
              />

              <Select
                label="Status"
                {...methods.register("status")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="deprecated">Deprecated</option>
              </Select>

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
                Create Template
              </Button>
            </div>
          </form>
        </FormProvider>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default TemplateCreateForm 