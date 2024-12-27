import React from "react"
import { useQuery } from "@tanstack/react-query"
import { 
  Card,
  Text,
  LineChart,
  BarChart
} from "@medusajs/ui"

interface Props {
  templateId: string
}

const TemplateAnalytics = ({ templateId }: Props) => {
  const { data, isLoading } = useQuery(
    ["template-analytics", templateId],
    async () => {
      const response = await fetch(`/admin/templates/${templateId}/analytics`)
      return response.json()
    }
  )

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Card.Title>Products Created</Card.Title>
          <Text className="text-3xl font-bold">
            {data?.totalProducts || 0}
          </Text>
        </Card>
        <Card>
          <Card.Title>Total Sales</Card.Title>
          <Text className="text-3xl font-bold">
            ${data?.totalSales || 0}
          </Text>
        </Card>
        <Card>
          <Card.Title>Active Products</Card.Title>
          <Text className="text-3xl font-bold">
            {data?.activeProducts || 0}
          </Text>
        </Card>
      </div>

      <Card>
        <Card.Title>Usage Over Time</Card.Title>
        <LineChart
          data={data?.usageOverTime || []}
          xAxis={[{ data: "date", label: "Date" }]}
          yAxis={[{ data: "count", label: "Products Created" }]}
        />
      </Card>

      <Card>
        <Card.Title>Field Usage Distribution</Card.Title>
        <BarChart
          data={data?.fieldUsage || []}
          xAxis={[{ data: "field", label: "Field Name" }]}
          yAxis={[{ data: "usage", label: "Usage Count" }]}
        />
      </Card>
    </div>
  )
}

export default TemplateAnalytics 