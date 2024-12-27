import {
  FilterableOrderProps,
  IOrderModuleService,
  UpdateOrderDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateOrdersStepInput = {
  selector: FilterableOrderProps
  update: UpdateOrderDTO // TODO: Update to UpdateOrderDTO[]
}

export const updateOrdersStepId = "update-orders"
/**
 * This step updates orders matching the specified filters.
 */
export const updateOrdersStep = createStep(
  updateOrdersStepId,
  async (data: UpdateOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listOrders(data.selector, {
      select: selects,
      relations,
    })

    const orders = await service.updateOrders(data.selector, data.update)

    return new StepResponse(orders, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrders(prevData as UpdateOrderDTO[])
  }
)
