import { AdditionalData, CreateOrderDTO } from "@medusajs/framework/types"
import { MedusaError, isDefined, isPresent } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { findOneOrAnyRegionStep } from "../../cart/steps/find-one-or-any-region"
import { findOrCreateCustomerStep } from "../../cart/steps/find-or-create-customer"
import { findSalesChannelStep } from "../../cart/steps/find-sales-channel"
import { validateLineItemPricesStep } from "../../cart/steps/validate-line-item-prices"
import { validateVariantPricesStep } from "../../cart/steps/validate-variant-prices"
import {
  PrepareLineItemDataInput,
  prepareLineItemData,
} from "../../cart/utils/prepare-line-item-data"
import { confirmVariantInventoryWorkflow } from "../../cart/workflows/confirm-variant-inventory"
import { useRemoteQueryStep } from "../../common"
import { createOrdersStep } from "../steps"
import { productVariantsFields } from "../utils/fields"
import { updateOrderTaxLinesWorkflow } from "./update-tax-lines"

function prepareLineItems(data) {
  const items = (data.input.items ?? []).map((item) => {
    const variant = data.variants.find((v) => v.id === item.variant_id)!

    const input: PrepareLineItemDataInput = {
      item,
      variant: variant,
      unitPrice: item.unit_price ?? undefined,
      isTaxInclusive:
        item.is_tax_inclusive ??
        variant?.calculated_price?.is_calculated_price_tax_inclusive,
      isCustomPrice: isDefined(item?.unit_price),
      taxLines: item.tax_lines || [],
      adjustments: item.adjustments || [],
    }

    if (variant && !input.unitPrice) {
      input.unitPrice = variant.calculated_price?.calculated_amount
    }

    return prepareLineItemData(input)
  })

  return items
}

function getOrderInput(data) {
  const shippingAddress = data.input.shipping_address ?? { id: undefined }
  delete shippingAddress.id

  const billingAddress = data.input.billing_address ?? { id: undefined }
  delete billingAddress.id

  const data_ = {
    ...data.input,
    shipping_address: isPresent(shippingAddress) ? shippingAddress : undefined,
    billing_address: isPresent(billingAddress) ? billingAddress : undefined,
    currency_code: data.input.currency_code ?? data.region.currency_code,
    region_id: data.region.id,
  }

  if (data.customerData.customer?.id) {
    data_.customer_id = data.customerData.customer.id
    data_.email = data.input?.email ?? data.customerData.customer.email
  }

  if (data.salesChannel?.id) {
    data_.sales_channel_id = data.salesChannel.id
  }

  return data_
}

export const createOrdersWorkflowId = "create-orders"
/**
 * This workflow creates an order.
 */
export const createOrderWorkflow = createWorkflow(
  createOrdersWorkflowId,
  (input: WorkflowData<CreateOrderDTO & AdditionalData>) => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? [])
        .map((item) => item.variant_id)
        .filter(Boolean) as string[]
    })

    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: input.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = transform(
      { input, region, customerData },
      (data) => {
        if (!data.region) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
        }

        return {
          currency_code: data.input.currency_code ?? data.region.currency_code,
          region_id: data.region.id,
          customer_id: data.customerData.customer?.id,
        }
      }
    )

    const variants = when({ variantIds }, ({ variantIds }) => {
      return !!variantIds.length
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "variants",
        fields: productVariantsFields,
        variables: {
          id: variantIds,
          calculated_price: {
            context: pricingContext,
          },
        },
      })
    })

    validateVariantPricesStep({ variants })

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: salesChannel.id,
        variants,
        items: input.items!,
      },
    })

    const orderInput = transform(
      { input, region, customerData, salesChannel },
      getOrderInput
    )

    const lineItems = transform({ input, variants }, prepareLineItems)

    validateLineItemPricesStep({ items: lineItems })

    const orderToCreate = transform({ lineItems, orderInput }, (data) => {
      return {
        ...data.orderInput,
        items: data.lineItems,
      }
    })

    const orders = createOrdersStep([orderToCreate])
    const order = transform({ orders }, (data) => data.orders?.[0])

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    const orderCreated = createHook("orderCreated", {
      order,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(order, {
      hooks: [orderCreated],
    })
  }
)

/**
 * @deprecated
 * Instead use the singular name "createOrderWorkflow"
 */
export const createOrdersWorkflow = createOrderWorkflow
