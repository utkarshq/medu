import { Context } from "@medusajs/types"
import { MedusaContextType } from "./context-parameter"

export function InjectTransactionManager(
  managerProperty?: string
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: any
  ): void {
    if (!target.MedusaContextIndex_) {
      throw new Error(
        `An error occured applying decorator '@InjectTransactionManager' to method ${String(
          propertyKey
        )}: Missing parameter with flag @MedusaContext`
      )
    }

    const originalMethod = descriptor.value
    managerProperty ??= "baseRepository_"

    const argIndex = target.MedusaContextIndex_[propertyKey]
    descriptor.value = async function (...args: any[]) {
      const context: Context = args[argIndex] ?? {}
      const originalContext = args[argIndex] ?? {}

      if (context?.transactionManager) {
        return await originalMethod.apply(this, args)
      }

      return await (!managerProperty
        ? this
        : this[managerProperty]
      ).transaction(
        async (transactionManager) => {
          const copiedContext = {} as Context
          for (const key in originalContext) {
            if (key === "manager" || key === "transactionManager") {
              continue
            }

            Object.defineProperty(copiedContext, key, {
              get: function () {
                return originalContext[key]
              },
              set: function (value) {
                originalContext[key] = value
              },
            })
          }

          copiedContext.transactionManager = transactionManager

          if (originalContext?.manager) {
            copiedContext.manager = originalContext?.manager
          }

          copiedContext.__type = MedusaContextType

          args[argIndex] = copiedContext

          return await originalMethod.apply(this, args)
        },
        {
          transaction: context?.transactionManager,
          isolationLevel: (context as Context)?.isolationLevel,
          enableNestedTransactions:
            (context as Context).enableNestedTransactions ?? false,
        }
      )
    }
  }
}
