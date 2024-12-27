import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const { template_ids, action, ...data } = req.body

  if (!Array.isArray(template_ids)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "template_ids must be an array"
    )
  }

  const result = await manager.transaction(async (transactionManager) => {
    switch (action) {
      case "publish":
        return await templateService
          .withTransaction(transactionManager)
          .publishTemplates(template_ids)
      
      case "archive":
        return await templateService
          .withTransaction(transactionManager)
          .archiveTemplates(template_ids)
          
      case "delete":
        return await templateService
          .withTransaction(transactionManager)
          .deleteTemplates(template_ids)
          
      case "update":
        return await templateService
          .withTransaction(transactionManager)
          .updateTemplates(template_ids, data)
          
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid action: ${action}`
        )
    }
  })

  res.json(result)
} 