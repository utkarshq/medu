import React from "react"
import { 
  Button, 
  Modal,
  Text,
  useNotification 
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Template } from "../../models"

interface Props {
  template: Template
  open: boolean
  onClose: () => void
}

const TemplateDeleteModal = ({ template, open, onClose }: Props) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(
    async () => {
      const response = await fetch(`/admin/templates/${template.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete template")
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["templates"])
        notification("Success", "Template deleted successfully", "success")
        navigate("/templates")
      },
      onError: (error) => {
        notification("Error", error.message, "error")
      },
    }
  )

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <h2>Delete Template</h2>
      </Modal.Header>
      
      <Modal.Body>
        <div className="mb-6">
          <Text>
            Are you sure you want to delete this template?
            This action cannot be undone.
          </Text>
          {template.fields?.length > 0 && (
            <Text className="mt-2 text-red-500">
              Warning: This template has {template.fields.length} fields that will also be deleted.
            </Text>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => mutate()}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default TemplateDeleteModal 