import { TypeDocOptions } from "typedoc"
import { getEntryPoints } from "../utils/get-options.js"

export const customModuleServiceNames: Record<string, string> = {
  "inventory-next": "IInventoryService",
  "stock-location-next": "IStockLocationService",
}

// if any module requires a custom formatting to their title representation,
// they're added to this object
export const customModuleTitles: Record<string, string> = {
  "api-key": "API Key",
}

// if any module requires custom options, they're added to this object
export const customModulesOptions: Record<string, Partial<TypeDocOptions>> = {
  "inventory-next": {
    entryPoints: getEntryPoints("packages/core/types/src/inventory/service.ts"),
  },
  "stock-location-next": {
    entryPoints: getEntryPoints(
      "packages/core/types/src/stock-location/service.ts"
    ),
  },
  "inventory-next-models": {
    entryPoints: getEntryPoints(
      "packages/modules/inventory/src/models/index.ts"
    ),
  },
  "stock-location-next-models": {
    entryPoints: getEntryPoints(
      "packages/modules/stock-location/src/models/index.ts"
    ),
  },
}

// a list of modules that now support DML
export const dmlModules = [
  "currency",
  "region",
  "product",
  "user",
  "auth",
  "pricing",
  "cart",
  "sales-channel",
  "api-key",
  "store",
  "customer",
  "inventory-next",
  "payment",
  "promotion",
  "stock-location-next",
  "tax",
]
