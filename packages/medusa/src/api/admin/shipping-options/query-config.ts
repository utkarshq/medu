export const defaultAdminShippingOptionFields = [
  "id",
  "name",
  "price_type",
  "data",
  "provider_id",
  "metadata",
  "created_at",
  "updated_at",
  "*rules",
  "*type",
  "*prices",
  "*prices.price_rules",
  "*service_zone",
  "*shipping_profile",
  "*provider",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminShippingOptionFields,
  isList: false,
}

export const listTransformQueryConfig = {
  ...retrieveTransformQueryConfig,
  isList: true,
}

export const defaultAdminShippingOptionRuleFields = [
  "id",
  "description",
  "attribute",
  "operator",
  "values.value",
]

export const retrieveRuleTransformQueryConfig = {
  defaults: defaultAdminShippingOptionRuleFields,
  isList: false,
}

export const listRuleTransformQueryConfig = {
  ...retrieveRuleTransformQueryConfig,
  isList: true,
}
