import { MedusaError } from "@medusajs/utils"
import { NextFunction, Request, Response } from "express"

export function errorHandler() {
  return (
    err: MedusaError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const status = err.status || 500
    const code = err.code || "unknown"
    const message = err.message || "An unknown error occurred"

    res.status(status).json({
      code,
      message,
      type: err.type,
    })
  }
} 