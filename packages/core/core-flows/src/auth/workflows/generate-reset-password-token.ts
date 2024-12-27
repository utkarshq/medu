import {
  AuthWorkflowEvents,
  generateJwtToken,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"

export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: {
    entityId: string
    actorType: string
    provider: string
    secret: string
  }) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["auth_identity_id", "provider_metadata"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
    })

    const token = transform(
      { input, providerIdentities },
      ({ input, providerIdentities }) => {
        const providerIdentity = providerIdentities?.[0]

        if (!providerIdentity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Provider identity with entity_id ${input.entityId} and provider ${input.provider} not found`
          )
        }

        const token = generateJwtToken(
          {
            entity_id: input.entityId,
            provider: input.provider,
            actor_type: input.actorType,
          },
          {
            secret: input.secret,
            expiresIn: "15m",
          }
        )

        return token
      }
    )

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: {
        entity_id: input.entityId,
        /**
         * Use `actor_type` instead. Will be removed in a future version.
         * @deprecated
         */
        actorType: input.actorType,
        actor_type: input.actorType,
        token,
      },
    })

    return new WorkflowResponse(token)
  }
)
