import fs from "fs/promises"
import { outdent } from "outdent"
import {
  File,
  isIdentifier,
  isObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import {
  crawl,
  getConfigObjectProperties,
  getParserOptions,
  normalizePath,
} from "../utils"
import { getRoute } from "./helpers"
import { NESTED_ROUTE_POSITIONS } from "@medusajs/admin-shared"

type RouteConfig = {
  label: boolean
  icon: boolean
  nested?: string
}

type MenuItem = {
  icon?: string
  label: string
  path: string
  nested?: string
}

type MenuItemResult = {
  import: string
  menuItem: MenuItem
}

export async function generateMenuItems(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getMenuItemResults(files)

  const imports = results.map((result) => result.import)
  const code = generateCode(results)

  return { imports, code }
}

function generateCode(results: MenuItemResult[]): string {
  return outdent`
        menuItems: [
            ${results
              .map((result) => formatMenuItem(result.menuItem))
              .join(",\n")}
        ]
    }
  `
}

function formatMenuItem(route: MenuItem): string {
  const { label, icon, path, nested } = route
  return `{
    label: ${label},
    icon: ${icon || "undefined"},
    path: "${path}",
    nested: ${nested ? `"${nested}"` : "undefined"}
  }`
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/routes`, "page", { min: 1 })
      )
    )
  ).flat()
  return files
}

async function getMenuItemResults(files: string[]): Promise<MenuItemResult[]> {
  const results = await Promise.all(files.map(parseFile))
  return results.filter((item): item is MenuItemResult => item !== null)
}

async function parseFile(
  file: string,
  index: number
): Promise<MenuItemResult | null> {
  const config = await getRouteConfig(file)

  if (!config) {
    return null
  }

  if (!config.label) {
    logger.warn(`Config is missing a label.`, {
      file,
    })
  }

  const import_ = generateImport(file, index)
  const menuItem = generateMenuItem(config, file, index)

  return {
    import: import_,
    menuItem,
  }
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import { config as ${generateRouteConfigName(index)} } from "${path}"`
}

function generateMenuItem(
  config: RouteConfig,
  file: string,
  index: number
): MenuItem {
  const configName = generateRouteConfigName(index)
  return {
    label: `${configName}.label`,
    icon: config.icon ? `${configName}.icon` : undefined,
    path: getRoute(file),
    nested: config.nested,
  }
}

async function getRouteConfig(file: string): Promise<RouteConfig | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File> | null = null

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return null
  }

  let config: RouteConfig | null = null

  try {
    traverse(ast, {
      ExportNamedDeclaration(path) {
        const properties = getConfigObjectProperties(path)
        if (!properties) {
          return
        }

        const hasProperty = (name: string) =>
          properties.some(
            (prop) => isObjectProperty(prop) && isIdentifier(prop.key, { name })
          )

        const hasLabel = hasProperty("label")
        if (!hasLabel) {
          return
        }

        const nested = properties.find(
          (prop) =>
            isObjectProperty(prop) && isIdentifier(prop.key, { name: "nested" })
        )

        const nestedValue = nested ? (nested as any).value.value : undefined

        if (nestedValue && !NESTED_ROUTE_POSITIONS.includes(nestedValue)) {
          logger.error(
            `Invalid nested route position: "${nestedValue}". Allowed values are: ${NESTED_ROUTE_POSITIONS.join(
              ", "
            )}`,
            {
              file,
            }
          )
          return
        }

        config = {
          label: hasLabel,
          icon: hasProperty("icon"),
          nested: nestedValue,
        }
      },
    })
  } catch (e) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: e,
    })
  }

  return config
}

function generateRouteConfigName(index: number): string {
  return `RouteConfig${index}`
}
