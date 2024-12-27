import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

type OptionsInput = (
  | FulfillmentWorkflow.CreateShippingOptionsWorkflowInput
  | FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput
)[]

export const validateShippingOptionPricesStepId =
  "validate-shipping-option-prices"

/**
 * Validate that shipping options can be crated based on provided price configuration.
 *
 * For flat rate prices, it validates that regions exist for the shipping option prices.
 * For calculated prices, it validates with the fulfillment provider if the price can be calculated.
 */
export const validateShippingOptionPricesStep = createStep(
  validateShippingOptionPricesStepId,
  async (options: OptionsInput, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    const optionIds = options.map(
      (option) =>
        (option as FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput).id
    )

    if (optionIds.length) {
      /**
       * This means we are validating an update of shipping options.
       * We need to ensure that all shipping options have price_type set
       * to correctly determine price updates.
       *
       * (On create, price_type must be defined already.)
       */
      const shippingOptions =
        await fulfillmentModuleService.listShippingOptions(
          {
            id: optionIds,
          },
          { select: ["id", "price_type", "provider_id"] }
        )

      const optionsMap = new Map(
        shippingOptions.map((option) => [option.id, option])
      )

      ;(
        options as FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
      ).forEach((option) => {
        option.price_type =
          option.price_type ?? optionsMap.get(option.id)?.price_type
        option.provider_id =
          option.provider_id ?? optionsMap.get(option.id)?.provider_id
      })
    }

    const flatRatePrices: FulfillmentWorkflow.UpdateShippingOptionPriceRecord[] =
      []
    const calculatedOptions: OptionsInput = []

    options.forEach((option) => {
      if (option.price_type === ShippingOptionPriceType.FLAT) {
        flatRatePrices.push(...(option.prices ?? []))
      }
      if (option.price_type === ShippingOptionPriceType.CALCULATED) {
        calculatedOptions.push(option)
      }
    })

    const validation =
      await fulfillmentModuleService.validateShippingOptionsForPriceCalculation(
        calculatedOptions as FulfillmentWorkflow.CreateShippingOptionsWorkflowInput[]
      )

    if (validation.some((v) => !v)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot calcuate pricing for: [${calculatedOptions
          .filter((o, i) => !validation[i])
          .map((o) => o.name)
          .join(", ")}] shipping option(s).`
      )
    }

    const regionIdSet = new Set<string>()

    flatRatePrices.forEach((price) => {
      if ("region_id" in price && price.region_id) {
        regionIdSet.add(price.region_id)
      }
    })

    if (regionIdSet.size === 0) {
      return new StepResponse(void 0)
    }

    const regionService = container.resolve(Modules.REGION)
    const regionList = await regionService.listRegions({
      id: Array.from(regionIdSet),
    })

    if (regionList.length !== regionIdSet.size) {
      const missingRegions = Array.from(regionIdSet).filter(
        (id) => !regionList.some((region) => region.id === id)
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot create prices for non-existent regions. Region with ids [${missingRegions.join(
          ", "
        )}] were not found.`
      )
    }

    return new StepResponse(void 0)
  }
)
