import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "@medusajs/admin-sdk"
import { Template } from "../../models"

export const useTemplate = (id: string) => {
  const { client } = useMedusa()

  const {
    data,
    isLoading,
    error,
  } = useQuery(
    ["template", id],
    async () => {
      const { template } = await client.admin.templates.retrieve(id)
      return template
    },
    {
      enabled: !!id,
    }
  )

  return {
    template: data as Template,
    isLoading,
    error,
  }
} 