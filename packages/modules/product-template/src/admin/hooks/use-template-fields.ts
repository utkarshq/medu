import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "@medusajs/admin-sdk"

export const useTemplateFields = (templateId: string) => {
  const { client } = useMedusa()

  const {
    data,
    isLoading,
    error,
  } = useQuery(
    ["template-fields", templateId],
    async () => {
      const { template } = await client.admin.templates.retrieve(templateId)
      return template.fields
    },
    {
      enabled: !!templateId,
    }
  )

  return {
    fields: data,
    isLoading,
    error,
  }
} 