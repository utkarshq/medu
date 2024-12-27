import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const updated = await manager.transaction(async (transactionManager) => {
    return await templateService
      .withTransaction(transactionManager)
      .updateTemplate(id, req.body)
  })

  res.json({ template: updated })
} 