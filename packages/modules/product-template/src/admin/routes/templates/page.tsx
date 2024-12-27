import React from "react"
import { 
  Container, 
  Table,
  Button,
  Badge,
  useToggleState
} from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { useTemplates } from "../../hooks/use-templates"
import { PlusIcon } from "@medusajs/icons"
import TemplateCreateForm from "../../components/template-create-form"

const TemplateListPage = () => {
  const navigate = useNavigate()
  const { templates, isLoading } = useTemplates()
  const [showCreate, setShowCreate] = useToggleState()

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Templates</h1>
          <p className="text-gray-500">Manage your product templates</p>
        </div>
        <Button
          variant="primary"
          onClick={setShowCreate.open}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Fields</Table.HeaderCell>
            <Table.HeaderCell>Last Updated</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {templates?.map((template) => (
            <Table.Row key={template.id}>
              <Table.Cell>{template.title}</Table.Cell>
              <Table.Cell>
                <Badge 
                  variant={
                    template.status === "published" ? "success" :
                    template.status === "draft" ? "default" : "danger"
                  }
                >
                  {template.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{template.fields?.length || 0} fields</Table.Cell>
              <Table.Cell>
                {new Date(template.updated_at).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate(`/templates/${template.id}`)}
                >
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {showCreate && (
        <TemplateCreateForm onClose={setShowCreate.close} />
      )}
    </Container>
  )
}

export default TemplateListPage 