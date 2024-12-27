import React from "react"
import { useForm } from "react-hook-form"
import { 
  Button, 
  Modal, 
  Input,
  useNotification 
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Template } from "../../models"

interface Props {
  template: Template
  open: boolean
  onClose: () => void
}

const TemplateDuplicateModal = ({ template, open, onClose }: Props) => {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: `${template.title} (Copy)`,
    },
  })

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = await fetch(`/admin/templates/${template.id}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to duplicate template")
      }

      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"])
        notification("Success", "Template duplicated successfully", "success")
        onClose()
      },
      onError: (error) => {
        notification("Error", error.message, "error")
      },
    }
  )

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <h2>Duplicate Template</h2>
      </Modal.Header>
      
      <Modal.Body>
        <form onSubmit={handleSubmit(mutate)}>
          <div className="mb-6">
            <Input
              label="New Template Title"
              required
              {...register("title", { required: "Title is required" })}
              error={errors.title?.message}
            />
          </div>

          <div className="flex justify-end gap-2">
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
              Duplicate
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default TemplateDuplicateModal 