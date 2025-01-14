import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const created = await manager.transaction(async (transactionManager) => {
    return await templateService
      .withTransaction(transactionManager)
      .createTemplate(req.body)
  })

  res.status(201).json({ template: created })
} 