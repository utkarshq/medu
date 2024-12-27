import { Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const templateService = req.scope.resolve("templateModuleService")

  const { product_data } = req.body

  try {
    const validationResult = await templateService.validateProductAgainstTemplate(
      id,
      product_data,
      {
        strict: req.query.strict === "true"
      }
    )

    res.json({
      valid: validationResult.valid,
      errors: validationResult.errors,
      warnings: validationResult.warnings
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.message
    )
  }
} 