import { useQuery } from "@tanstack/react-query"
import { Template } from "../../models"
import { useMedusa } from "@medusajs/admin-sdk"

export const useTemplates = (options = {}) => {
  const { client } = useMedusa()

  const {
    data,
    isLoading,
    error,
    ...rest
  } = useQuery(
    ["templates", options],
    async () => {
      const { templates } = await client.admin.templates.list(options)
      return templates
    },
    {
      keepPreviousData: true,
      ...options,
    }
  )

  return {
    templates: data as Template[],
    isLoading,
    error,
    ...rest,
  }
} 