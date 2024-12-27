import { Router } from "express"
import { wrapHandler } from "@medusajs/utils"
import createTemplate from "./create-template"
import listTemplates from "./list-templates"
import getTemplate from "./get-template"
import updateTemplate from "./update-template"
import deleteTemplate from "./delete-template"
import createProduct from "./create-product"
import createVersion from "./create-version"
import getAnalytics from "./get-analytics"
import bulkUpdate from "./bulk-update"
import duplicateTemplate from "./duplicate-template"
import validateProduct from "./validate-product"
import { 
  validateTemplateCreate, 
  validateTemplateUpdate,
  validateBulkOperation 
} from "../../../validators/template"

export default (app) => {
  const templateRouter = Router()
  app.use("/templates", templateRouter)

  // Template CRUD
  templateRouter.post("/", validateTemplateCreate, wrapHandler(createTemplate))
  templateRouter.get("/", wrapHandler(listTemplates))
  templateRouter.get("/:id", wrapHandler(getTemplate))
  templateRouter.put("/:id", validateTemplateUpdate, wrapHandler(updateTemplate))
  templateRouter.delete("/:id", wrapHandler(deleteTemplate))

  // Template versioning
  templateRouter.post("/:id/versions", wrapHandler(createVersion))
  
  // Product creation from template
  templateRouter.post("/:id/products", wrapHandler(createProduct))
  
  // Analytics
  templateRouter.get("/:id/analytics", wrapHandler(getAnalytics))
  
  // Bulk operations
  templateRouter.post("/bulk", validateBulkOperation, wrapHandler(bulkUpdate))
  
  // Template duplication
  templateRouter.post("/:id/duplicate", wrapHandler(duplicateTemplate))
  
  // Template validation
  templateRouter.post("/:id/validate", wrapHandler(validateProduct))

  return templateRouter
} 