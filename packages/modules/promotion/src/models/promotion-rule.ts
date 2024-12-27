import { PromotionUtils, model } from "@medusajs/framework/utils"
import ApplicationMethod from "./application-method"
import Promotion from "./promotion"
import PromotionRuleValue from "./promotion-rule-value"

const PromotionRule = model
  .define(
    {
      name: "PromotionRule",
      tableName: "promotion_rule",
    },
    {
      id: model.id({ prefix: "prorul" }).primaryKey(),
      description: model.text().nullable(),
      attribute: model.text().index("IDX_promotion_rule_attribute"),
      operator: model
        .enum(PromotionUtils.PromotionRuleOperator)
        .index("IDX_promotion_rule_operator"),
      values: model.hasMany(() => PromotionRuleValue, {
        mappedBy: "promotion_rule",
      }),
      promotions: model.manyToMany(() => Promotion, {
        mappedBy: "rules",
      }),
      method_target_rules: model.manyToMany(() => ApplicationMethod, {
        mappedBy: "target_rules",
      }),
      method_buy_rules: model.manyToMany(() => ApplicationMethod, {
        mappedBy: "buy_rules",
      }),
    }
  )
  .cascades({
    delete: ["values"],
  })

export default PromotionRule
