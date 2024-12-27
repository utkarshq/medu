import { model } from "@medusajs/framework/utils"
import { Product } from "@models"

const ProductType = model
  .define("ProductType", {
    id: model.id({ prefix: "ptyp" }).primaryKey(),
    value: model.text().searchable(),
    metadata: model.json().nullable(),
    product: model.hasMany(() => Product, {
      mappedBy: "type",
    }),
  })
  .indexes([
    {
      name: "IDX_type_value_unique",
      on: ["value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductType
