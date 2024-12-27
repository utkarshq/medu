export const defaultAdminReturnFields = [
  "id",
  "order_id",
  "exchange_id",
  "claim_id",
  "display_id",
  "location_id",
  "order_version",
  "status",
  "metadata",
  "no_notification",
  "refund_amount",
  "created_by",
  "created_at",
  "updated_at",
  "canceled_at",
  "requested_at",
  "received_at",
]

export const defaultAdminDetailsReturnFields = [
  ...defaultAdminReturnFields,
  "items.*",
  "items.reason.*",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminDetailsReturnFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminReturnFields,
  defaultLimit: 20,
  isList: true,
}
