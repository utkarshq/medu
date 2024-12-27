import { Request, Response } from "express"
import { pickBy, identity } from "lodash"

export default async (req: Request, res: Response) => {
  const templateService = req.scope.resolve("templateModuleService")

  const { limit, offset } = req.query
  
  // Build filter object from query params
  const filters = pickBy({
    status: req.query.status,
    created_at: req.query.created_at,
    updated_at: req.query.updated_at,
    q: req.query.q // For search
  }, identity)

  const [templates, count] = await templateService.listAndCount(
    filters,
    {
      relations: ["fields"],
      skip: parseInt(offset as string) || 0,
      take: parseInt(limit as string) || 20,
      order: { created_at: "DESC" }
    }
  )

  res.json({
    templates,
    count,
    offset: parseInt(offset as string) || 0,
    limit: parseInt(limit as string) || 20
  })
} 