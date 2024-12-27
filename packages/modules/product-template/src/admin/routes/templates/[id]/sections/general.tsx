import React from "react"
import { 
  Card,
  Input,
  TextArea,
  Select,
  Switch,
  Button,
  useNotification
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Template } from "../../../../../models"

interface Props {
  template: Template
}

const TemplateGeneralSection = ({ template }: Props) => {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      title: template.title,
      description: template.description,
      status: template.status,
      is_overridable: template.is_overridable
    }
  })

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = await fetch(`/admin/templates/${template.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
      },
      onError: (error) => {
        notification("Error", error.message, "error")
      }
    }
  )

  return (
    <form onSubmit={handleSubmit(mutate)}>
      <Card>
        <Card.Header>
          <Card.Title>General Information</Card.Title>
          <Card.Description>
            Basic information about the template
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="grid gap-4">
            <Input
              label="Title"
              {...register("title")}
            />
            
            <TextArea
              label="Description"
              rows={3}
              {...register("description")}
            />

            <Select
              label="Status"
              {...register("status")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="deprecated">Deprecated</option>
            </Select>

            <Switch
              label="Allow Field Override"
              description="Allow products to override template field values"
              {...register("is_overridable")}
            />
          </div>
        </Card.Content>

        <Card.Footer>
          <div className="flex justify-end">
            <Button
              variant="primary"
              type="submit"
              disabled={!isDirty}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </form>
  )
}

export default TemplateGeneralSection 