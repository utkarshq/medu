import { Request, Response } from "express"
import { MedusaError } from "@medusajs/framework/utils"

export default async (req: Request, res: Response) => {
  const templateService = req.scope.resolve("templateModuleService")

  try {
    const [templates, count] = await templateService.listAndCount(req.query)
    
    res.json({
      templates,
      count,
      offset: req.query.offset,
      limit: req.query.limit
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.message
    )
  }
} 