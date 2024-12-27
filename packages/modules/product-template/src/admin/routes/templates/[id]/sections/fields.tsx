import React from "react"
import { 
  Card,
  Table,
  Badge,
  IconButton,
  Button,
  useNotification
} from "@medusajs/ui"
import { PencilIcon, TrashIcon } from "@medusajs/icons"
import { Template } from "../../../../../models"
import { useNavigate } from "react-router-dom"

interface Props {
  template: Template
}

const TemplateFieldsSection = ({ template }: Props) => {
  const navigate = useNavigate()
  const notification = useNotification()

  const handleDeleteField = async (fieldId: string) => {
    try {
      const response = await fetch(
        `/admin/templates/${template.id}/fields/${fieldId}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to delete field")
      }

      notification("Success", "Field deleted successfully", "success")
    } catch (error) {
      notification("Error", error.message, "error")
    }
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <div>
            <Card.Title>Template Fields</Card.Title>
            <Card.Description>
              Manage the fields in this template
            </Card.Description>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate(`/templates/${template.id}/fields/new`)}
          >
            Add Field
          </Button>
        </div>
      </Card.Header>

      <Card.Content>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Field Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Required</Table.HeaderCell>
              <Table.HeaderCell>Default Value</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {template.fields?.map((field) => (
              <Table.Row key={field.id}>
                <Table.Cell>{field.field_name}</Table.Cell>
                <Table.Cell>
                  <Badge variant={
                    field.field_type === "static" ? "blue" :
                    field.field_type === "dynamic" ? "green" : "orange"
                  }>
                    {field.field_type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {field.is_required ? (
                    <Badge variant="red">Required</Badge>
                  ) : (
                    <Badge variant="grey">Optional</Badge>
                  )}
                </Table.Cell>
                <Table.Cell>{field.default_value || "-"}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <IconButton
                      variant="secondary"
                      size="small"
                      onClick={() => navigate(
                        `/templates/${template.id}/fields/${field.id}`
                      )}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  )
}

export default TemplateFieldsSection 