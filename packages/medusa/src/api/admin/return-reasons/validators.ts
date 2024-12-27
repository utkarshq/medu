import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const AdminGetReturnReasonsReturnReasonParams =
  createSelectParams().merge(
    z.object({
      id: z.union([z.string(), z.array(z.string())]).optional(),
      value: z.union([z.string(), z.array(z.string())]).optional(),
      label: z.union([z.string(), z.array(z.string())]).optional(),
      description: z.union([z.string(), z.array(z.string())]).optional(),
      parent_return_reason_id: z
        .union([z.string(), z.array(z.string())])
        .optional(),
      created_at: createOperatorMap().optional(),
      updated_at: createOperatorMap().optional(),
      deleted_at: createOperatorMap().optional(),
    })
  )

export type AdminGetReturnReasonsReturnReasonParamsType = z.infer<
  typeof AdminGetReturnReasonsReturnReasonParams
>

export const AdminGetReturnReasonsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  value: z.union([z.string(), z.array(z.string())]).optional(),
  label: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
  parent_return_reason_id: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export const AdminGetReturnReasonsParams = createFindParams({
  offset: 0,
  limit: 20,
})
  .merge(AdminGetReturnReasonsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetReturnReasonsParamsFields))

export type AdminGetReturnReasonsParamsType = z.infer<
  typeof AdminGetReturnReasonsParams
>

export const AdminCreateReturnReason = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().nullish(),
  parent_return_reason_id: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminCreateReturnReasonType = z.infer<
  typeof AdminCreateReturnReason
>

export const AdminUpdateReturnReason = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})
export type AdminUpdateReturnReasonType = z.infer<
  typeof AdminUpdateReturnReason
>
