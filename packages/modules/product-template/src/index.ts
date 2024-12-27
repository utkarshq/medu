import { Module } from "@medusajs/framework/utils"
import TemplateModuleService from "./services/template-module-service"

export const TEMPLATE_MODULE = "templateModuleService"

export default Module(TEMPLATE_MODULE, {
  service: TemplateModuleService,
}) 