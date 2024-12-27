import {
  CalculateShippingOptionPriceDTO,
  Constructor,
  DAL,
  FulfillmentOption,
  FulfillmentTypes,
  IFulfillmentProvider,
  Logger,
} from "@medusajs/framework/types"
import {
  MedusaError,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/framework/utils"
import { FulfillmentProvider } from "@models"

type InjectedDependencies = {
  logger?: Logger
  fulfillmentProviderRepository: DAL.RepositoryService
  [key: `fp_${string}`]: FulfillmentTypes.IFulfillmentProvider
}

// TODO rework DTO's

export default class FulfillmentProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  FulfillmentProvider
) {
  protected readonly fulfillmentProviderRepository_: DAL.RepositoryService
  #logger: Logger

  constructor(container: InjectedDependencies) {
    super(container)
    this.fulfillmentProviderRepository_ =
      container.fulfillmentProviderRepository
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<IFulfillmentProvider>,
    optionName?: string
  ) {
    if (!(providerClass as any).identifier) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Trying to register a fulfillment provider without an identifier.`
      )
    }
    return `${(providerClass as any).identifier}_${optionName}`
  }

  protected retrieveProviderRegistration(
    providerId: string
  ): FulfillmentTypes.IFulfillmentProvider {
    try {
      return this.__container__[`fp_${providerId}`]
    } catch (err) {
      const errMessage = `
      Unable to retrieve the fulfillment provider with id: ${providerId}
      Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.
      `
      this.#logger.error(errMessage)
      throw new Error(errMessage)
    }
  }

  async listFulfillmentOptions(providerIds: string[]): Promise<any[]> {
    return await promiseAll(
      providerIds.map(async (p) => {
        const provider = this.retrieveProviderRegistration(p)
        return {
          provider_id: p,
          options: (await provider.getFulfillmentOptions()) as Record<
            string,
            unknown
          >[],
        }
      })
    )
  }

  async getFulfillmentOptions(
    providerId: string
  ): Promise<FulfillmentOption[]> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.getFulfillmentOptions()
  }

  async validateFulfillmentData(
    providerId: string,
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateFulfillmentData(optionData, data, context)
  }

  async validateOption(providerId: string, data: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.validateOption(data)
  }

  async canCalculate(providerId: string, data: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.canCalculate(data)
  }

  async calculatePrice(
    providerId: string,
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.calculatePrice(optionData, data, context)
  }

  async createFulfillment(
    providerId: string,
    data: object,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.createFulfillment(data, items, order, fulfillment)
  }

  async cancelFulfillment(
    providerId: string,
    fulfillment: Record<string, unknown>
  ): Promise<any> {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.cancelFulfillment(fulfillment)
  }

  async createReturn(providerId: string, fulfillment: Record<string, unknown>) {
    const provider = this.retrieveProviderRegistration(providerId)
    return await provider.createReturnFulfillment(fulfillment)
  }
}
