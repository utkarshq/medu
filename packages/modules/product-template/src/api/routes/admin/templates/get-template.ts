import { Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")

  const template = await templateService.retrieveTemplate(id, {
    relations: ["fields", "products"]
  })

  if (!template) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Template with id ${id} was not found`
    )
  }

  res.json({ template })
} 