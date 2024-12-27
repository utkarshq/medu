import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceListRule } from "@models"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { defaultPriceListRuleData } from "./data"

export * from "./data"

export async function createPriceListRules(
  manager: SqlEntityManager,
  priceListRuleData: any[] = defaultPriceListRuleData
): Promise<PriceListRule[]> {
  const priceListRules: PriceListRule[] = []

  for (let data of priceListRuleData) {
    const plr = manager.create(toMikroORMEntity(PriceListRule), data)

    priceListRules.push(plr)
  }

  await manager.persistAndFlush(priceListRules)

  return priceListRules
}
