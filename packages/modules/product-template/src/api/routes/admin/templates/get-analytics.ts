import { Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")

  const {
    start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end_date = new Date(),
    group_by = "day"
  } = req.query

  const analytics = await templateService.getTemplateAnalytics(id, {
    start_date: start_date as string,
    end_date: end_date as string,
    group_by: group_by as "day" | "week" | "month",
    include: [
      "products_created",
      "total_sales",
      "field_usage",
      "variant_distribution",
      "price_ranges"
    ]
  })

  res.json(analytics)
} 