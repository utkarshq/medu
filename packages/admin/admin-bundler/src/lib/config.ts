import { VIRTUAL_MODULES } from "@medusajs/admin-shared"
import path from "path"
import { Config } from "tailwindcss"
import type { InlineConfig } from "vite"

import { BundlerOptions } from "../types"

export async function getViteConfig(
  options: BundlerOptions
): Promise<InlineConfig> {
  const { searchForWorkspaceRoot, mergeConfig } = await import("vite")
  const { default: react } = await import("@vitejs/plugin-react")
  const { default: medusa } = await import("@medusajs/admin-vite-plugin")

  const getPort = await import("get-port")
  const hmrPort = await getPort.default()

  const root = path.resolve(__dirname, "./")

  const backendUrl = options.backendUrl ?? ""
  const storefrontUrl = options.storefrontUrl ?? ""

  const baseConfig: InlineConfig = {
    root,
    base: options.path,
    build: {
      emptyOutDir: true,
      outDir: path.resolve(process.cwd(), options.outDir),
    },
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-runtime",
        "react-dom/client",
        "react-router-dom",
        "@medusajs/ui",
        "@medusajs/dashboard",
      ],
      exclude: [...VIRTUAL_MODULES],
    },
    define: {
      __BASE__: JSON.stringify(options.path),
      __BACKEND_URL__: JSON.stringify(backendUrl),
      __STOREFRONT_URL__: JSON.stringify(storefrontUrl),
    },
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
      hmr: {
        port: hmrPort,
      },
    },
    css: {
      postcss: {
        plugins: [
          require("tailwindcss")({
            config: createTailwindConfig(root, options.sources),
          }),
        ],
      },
    },
    plugins: [
      react(),
      medusa({
        sources: options.sources,
      }),
    ],
  }

  if (options.vite) {
    const customConfig = options.vite(baseConfig)
    return mergeConfig(baseConfig, customConfig)
  }

  return baseConfig
}

function createTailwindConfig(entry: string, sources: string[] = []) {
  const root = path.join(entry, "**/*.{js,ts,jsx,tsx}")
  const html = path.join(entry, "index.html")

  let dashboard = ""

  try {
    dashboard = path.join(
      path.dirname(require.resolve("@medusajs/dashboard")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  let ui: string = ""

  try {
    ui = path.join(
      path.dirname(require.resolve("@medusajs/ui")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  const extensions = sources.map((s) => path.join(s, "**/*.{js,ts,jsx,tsx}"))

  const config: Config = {
    presets: [require("@medusajs/ui-preset")],
    content: [html, root, dashboard, ui, ...extensions],
    darkMode: "class",
  }

  return config
}
