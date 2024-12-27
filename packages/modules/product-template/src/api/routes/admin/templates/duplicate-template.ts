import { Request, Response } from "express"
import { EntityManager } from "typeorm"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")
  const manager: EntityManager = req.scope.resolve("manager")

  const duplicated = await manager.transaction(async (transactionManager) => {
    return await templateService
      .withTransaction(transactionManager)
      .duplicateTemplate(id, {
        ...req.body,
        title: req.body.title || `Copy of ${id}`,
        status: "draft" // Always start as draft
      })
  })

  res.status(201).json({ template: duplicated })
} 