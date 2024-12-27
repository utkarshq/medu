import { Request, Response } from "express"
import { EntityManager } from "typeorm"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const newVersion = await manager.transaction(async (transactionManager) => {
    return await templateService
      .withTransaction(transactionManager)
      .createNewVersion(id, req.body)
  })

  res.json({ template: newVersion })
} 