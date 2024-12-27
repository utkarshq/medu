import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"
import { TemplateService } from "../../../../services"
import { CreateTemplateDTO } from "../../../../types"

export default async (req: Request, res: Response) => {
  const templateService: TemplateService = req.scope.resolve("templateService")
  const manager: EntityManager = req.scope.resolve("manager")

  const validated = await validateCreateTemplateRequest(req.body)

  await manager.transaction(async (transactionManager) => {
    const template = await templateService
      .withTransaction(transactionManager)
      .create(validated)

    res.status(201).json({ template })
  })
}

const validateCreateTemplateRequest = async (
  data: CreateTemplateDTO
): Promise<CreateTemplateDTO> => {
  const schema = CreateTemplateSchema.parse(data)
  return schema
} 