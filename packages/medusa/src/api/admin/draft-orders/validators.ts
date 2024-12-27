import { z } from "zod"
import {
  AddressPayload,
  applyAndAndOrOperators,
  BigNumberInput,
} from "../../utils/common-validators"
import {
  createFindParams,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"

export type AdminGetOrderParamsType = z.infer<typeof AdminGetOrderParams>
export const AdminGetOrderParams = createSelectParams()

export const AdminGetOrdersParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
})

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>
export const AdminGetOrdersParams = createFindParams({
  limit: 50,
  offset: 0,
})
  .merge(AdminGetOrdersParamsFields)
  .merge(applyAndAndOrOperators(AdminGetOrdersParamsFields))

enum Status {
  completed = "completed",
}

const ShippingMethod = z.object({
  shipping_method_id: z.string().nullish(),
  name: z.string(),
  shipping_option_id: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  amount: BigNumberInput,
})

const Item = z.object({
  title: z.string().nullish(),
  variant_sku: z.string().nullish(),
  variant_barcode: z.string().nullish(),
  /**
   * Use variant_sku instead
   * @deprecated
   */
  sku: z.string().nullish(),
  /**
   * Use variant_barcode instead
   * @deprecated
   */
  barcode: z.string().nullish(),
  variant_id: z.string().nullish(),
  unit_price: BigNumberInput.nullish(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminCreateDraftOrderType = z.infer<typeof CreateDraftOrder>
const CreateDraftOrder = z
  .object({
    status: z.nativeEnum(Status).optional(),
    sales_channel_id: z.string().nullish(),
    email: z.string().nullish(),
    customer_id: z.string().nullish(),
    billing_address: AddressPayload.optional(),
    shipping_address: AddressPayload.optional(),
    items: z.array(Item).optional(),
    region_id: z.string(),
    promo_codes: z.array(z.string()).optional(),
    currency_code: z.string().nullish(),
    no_notification_order: z.boolean().optional(),
    shipping_methods: z.array(ShippingMethod),
    metadata: z.record(z.unknown()).nullish(),
  })
  .strict()

export const AdminCreateDraftOrder = WithAdditionalData(
  CreateDraftOrder,
  (schema) => {
    return schema.refine(
      (data) => {
        if (!data.email && !data.customer_id) {
          return false
        }

        return true
      },
      { message: "Either email or customer_id must be provided" }
    )
  }
)
