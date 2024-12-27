import { model } from "@medusajs/framework/utils"
import Template from "./template"

const TemplateField = model.define("template_field", {
  id: model.id().primaryKey(),
  template: model.belongsTo(() => Template),
  field_name: model.text(),
  field_type: model.enum(["static", "dynamic", "optional"]),
  default_value: model.text().nullable(),
  validation_rules: model.json().nullable(), // For field-specific validation
  sort_order: model.number().default(0), // For ordering fields
  is_required: model.boolean().default(false),
  metadata: model.json().nullable(), // For extensibility
})

export default TemplateField 