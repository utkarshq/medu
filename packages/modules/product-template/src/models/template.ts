import { model } from "@medusajs/framework/utils"
import TemplateField from "./template-field"
import { Product } from "@medusajs/product/src/models" // Import the Product model

const Template = model.define("template", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  metadata: model.json().nullable(),
  status: model.enum(["draft", "published", "deprecated"]),
  is_overridable: model.boolean().default(false),
  version: model.number().default(1),
  created_by: model.text(),
  
  variant_config: model.json().required(),
  product_fields: model.json().required(),
  settings: model.json().nullable(),
  
  // Track template usage
  products: model.hasMany(() => Product, {
    mappedBy: "template",
  }),
  
  // Version control
  version: model.number().default(1),
  parent_template: model.belongsTo(() => Template, {
    nullable: true,
  }),
  
  fields: model.hasMany(() => TemplateField, {
    mappedBy: "template",
  }),
})
.cascades({
  delete: ["fields"], // Don't cascade delete products
})

export default Template 