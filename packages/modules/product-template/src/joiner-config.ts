import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"

export const joinerConfig = defineJoinerConfig(Modules.TEMPLATE, {
  linkableKeys: {
    template_id: "Template",
  },
}) 