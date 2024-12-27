import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  setShippingOptionsPricesStep,
  upsertShippingOptionsStep,
} from "../steps"
import { validateFulfillmentProvidersStep } from "../steps/validate-fulfillment-providers"
import { validateShippingOptionPricesStep } from "../steps/validate-shipping-option-prices"
import { ShippingOptionPriceType } from "@medusajs/framework/utils"

export const updateShippingOptionsWorkflowId =
  "update-shipping-options-workflow"
/**
 * This workflow updates one or more shipping options.
 */
export const updateShippingOptionsWorkflow = createWorkflow(
  updateShippingOptionsWorkflowId,
  (
    input: WorkflowData<
      FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
    >
  ): WorkflowResponse<FulfillmentWorkflow.UpdateShippingOptionsWorkflowOutput> => {
    parallelize(
      validateFulfillmentProvidersStep(input),
      validateShippingOptionPricesStep(input)
    )

    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        const prices = (
          option as FulfillmentWorkflow.UpdateFlatRateShippingOptionInput
        ).prices

        delete (option as FulfillmentWorkflow.UpdateFlatRateShippingOptionInput)
          .prices

        /**
         * When we are updating an option to be calculated, remove the prices.
         */
        const isCalculatedOption =
          option.price_type === ShippingOptionPriceType.CALCULATED

        return {
          shipping_option_index: index,
          prices: isCalculatedOption ? [] : prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const updatedShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: updatedShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            const option = data.shippingOptions[shipping_option_index]

            return {
              id: option.id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
        }
      }
    )

    setShippingOptionsPricesStep(
      normalizedShippingOptionsPrices.shippingOptionsPrices
    )

    return new WorkflowResponse(updatedShippingOptions)
  }
)
