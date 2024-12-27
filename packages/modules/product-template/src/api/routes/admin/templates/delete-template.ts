import { Request, Response } from "express"
import { EntityManager } from "typeorm"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    await templateService
      .withTransaction(transactionManager)
      .deleteTemplate(id)
  })

  res.json({
    id,
    object: "template",
    deleted: true
  })
} 