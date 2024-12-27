import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const product = await manager.transaction(async (transactionManager) => {
    return await templateService
      .withTransaction(transactionManager)
      .createProductFromTemplate(id, req.body)
  })

  res.status(201).json({ product })
} 