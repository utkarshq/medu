import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, Badge } from "@medusajs/ui"

const TemplateVersionHistory = ({ templateId }) => {
  const { data: versions, isLoading } = useQuery(
    ["template-versions", templateId],
    async () => {
      const response = await fetch(`/admin/templates/${templateId}/versions`)
      return response.json()
    }
  )

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Version</Table.HeaderCell>
          <Table.HeaderCell>Created At</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Changes</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {versions?.map((version) => (
          <Table.Row key={version.id}>
            <Table.Cell>v{version.version}</Table.Cell>
            <Table.Cell>{new Date(version.created_at).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              <Badge variant={version.status === "deprecated" ? "red" : "green"}>
                {version.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>{version.change_summary}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default TemplateVersionHistory 