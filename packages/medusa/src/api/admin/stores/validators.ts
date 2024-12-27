import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export type AdminGetStoreParamsType = z.infer<typeof AdminGetStoreParams>
export const AdminGetStoreParams = createSelectParams()

export const AdminGetStoresParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetStoresParamsType = z.infer<typeof AdminGetStoresParams>
export const AdminGetStoresParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetStoresParamsFields)
  .merge(applyAndAndOrOperators(AdminGetStoresParamsFields))

export type AdminUpdateStoreType = z.infer<typeof AdminUpdateStore>
export const AdminUpdateStore = z.object({
  name: z.string().optional(),
  supported_currencies: z
    .array(
      z.object({
        currency_code: z.string(),
        is_default: z.boolean().optional(),
        is_tax_inclusive: z.boolean().optional(),
      })
    )
    .optional(),
  default_sales_channel_id: z.string().nullish(),
  default_region_id: z.string().nullish(),
  default_location_id: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})