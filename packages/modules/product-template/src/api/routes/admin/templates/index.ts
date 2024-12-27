import { Router } from "express"
import { wrapHandler } from "@medusajs/framework/utils"
import listTemplates from "./list-templates"
import createTemplate from "./create-template"
import getTemplate from "./get-template"
import updateTemplate from "./update-template"

const router = Router()

export default (app) => {
  app.use("/admin/templates", router)

  router.get("/", wrapHandler(listTemplates))
  router.post("/", wrapHandler(createTemplate))
  router.get("/:id", wrapHandler(getTemplate))
  router.put("/:id", wrapHandler(updateTemplate))

  return router
} 