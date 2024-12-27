export const defaultAdminReturnReasonFields = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
]

export const defaultAdminRetrieveReturnReasonFields = [
  "id",
  "value",
  "label",
  "parent_return_reason_id",
  "description",
  "created_at",
  "updated_at",
  "deleted_at",
  "parent_return_reason.*",
  "return_reason_children.*",
]

export const retrieveTransformQueryConfig = {
  defaults: defaultAdminRetrieveReturnReasonFields,
  isList: false,
}

export const listTransformQueryConfig = {
  defaults: defaultAdminReturnReasonFields,
  defaultLimit: 20,
  isList: true,
}
