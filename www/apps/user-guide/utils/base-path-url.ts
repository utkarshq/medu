import { getLinkWithBasePath } from "docs-ui"

export function basePathUrl(path = "") {
  return getLinkWithBasePath(path, process.env.NEXT_PUBLIC_BASE_PATH)
}
