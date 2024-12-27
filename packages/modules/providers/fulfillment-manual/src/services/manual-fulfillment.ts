import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  FulfillmentOption,
} from "@medusajs/types"

// TODO rework type and DTO's

export class ManualFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "manual"

  constructor() {
    super()
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: "manual-fulfillment",
      },
      {
        id: "manual-fulfillment-return",
        is_return: true,
      },
    ]
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any> {
    return data
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<CalculatedShippingOptionPrice> {
    throw new Error("Manual fulfillment does not support price calculation")
  }

  async canCalculate(): Promise<boolean> {
    return false
  }

  async validateOption(data: Record<string, any>): Promise<boolean> {
    return true
  }

  async createFulfillment(): Promise<Record<string, any>> {
    // No data is being sent anywhere
    return {}
  }

  async cancelFulfillment(): Promise<any> {
    return {}
  }

  async createReturnFulfillment(): Promise<any> {
    return {}
  }
}