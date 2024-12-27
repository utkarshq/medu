import { ModuleExports } from "@medusajs/modules-sdk"
import { TemplateModuleService } from "./services/template-module-service"
import { templateRouter } from "./api/routes/admin/templates"
import { errorHandler } from "./api/middlewares/error-handler"

export const service = TemplateModuleService
export const loaders = []
export const migrations = [
  require("./migrations/InitialSetup"),
  require("./migrations/AddTemplateProductRelation")
]

export const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  routes: [templateRouter],
  middlewares: [errorHandler]
}

export default moduleDefinition 