import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { OrderPreviewDTO } from "@medusajs/types"
import {
  ChangeActionType,
  MedusaError,
  OrderChangeStatus,
} from "@medusajs/utils"

import { useQueryGraphStep } from "../../../common"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"

/**
 * This step validates that an order transfer can be accepted.
 */
export const acceptOrderTransferValidationStep = createStep(
  "accept-order-transfer-validation",
  async function ({
    token,
    order,
    orderChange,
  }: {
    token: string
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfOrderIsCancelled({ order })

    if (!orderChange || orderChange.change_type !== "transfer") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order ${order.id} does not have an order transfer request.`
      )
    }
    const transferCustomerAction = orderChange.actions.find(
      (a) => a.action === ChangeActionType.TRANSFER_CUSTOMER
    )

    if (!token.length || token !== transferCustomerAction?.details!.token) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Invalid token.")
    }
  }
)

export const acceptOrderTransferWorkflowId = "accept-order-transfer-workflow"
/**
 * This workflow accepts an order transfer.
 */
export const acceptOrderTransferWorkflow = createWorkflow(
  acceptOrderTransferWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.AcceptOrderTransferWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: ["id", "email", "status", "customer_id"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "order-query" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    const orderChangeQuery = useQueryGraphStep({
      entity: "order_change",
      fields: [
        "id",
        "status",
        "change_type",
        "actions.id",
        "actions.order_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.REQUESTED],
      },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeQuery },
      ({ orderChangeQuery }) => orderChangeQuery.data[0]
    )

    acceptOrderTransferValidationStep({
      order,
      orderChange,
      token: input.token,
    })

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
