import { dynamicImport, promiseAll, readDirRecursive } from "@medusajs/utils"
import { Dirent } from "fs"
import { access } from "fs/promises"
import { join } from "path"
import { logger } from "../logger"

export class WorkflowLoader {
  /**
   * The directory from which to load the workflows
   * @private
   */
  #sourceDir: string | string[]

  /**
   * The list of file names to exclude from the subscriber scan
   * @private
   */
  #excludes: RegExp[] = [
    /index\.js/,
    /index\.ts/,
    /\.DS_Store/,
    /(\.ts\.map|\.js\.map|\.d\.ts|\.md)/,
    /^_[^/\\]*(\.[^/\\]+)?$/,
  ]

  constructor(sourceDir: string | string[]) {
    this.#sourceDir = sourceDir
  }

  /**
   * Load workflows from the source paths, workflows are registering themselves,
   * therefore we only need to import them
   */
  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const promises = normalizedSourcePath.map(async (sourcePath) => {
      try {
        await access(sourcePath)
      } catch {
        logger.info(`No workflow to load from ${sourcePath}. skipped.`)
        return
      }

      return await readDirRecursive(sourcePath).then(async (entries) => {
        const fileEntries = entries.filter((entry: Dirent) => {
          return (
            !entry.isDirectory() &&
            !this.#excludes.some((exclude) => exclude.test(entry.name))
          )
        })

        logger.debug(`Registering workflows from ${sourcePath}.`)

        return await promiseAll(
          fileEntries.map(async (entry: Dirent) => {
            const fullPath = join(entry.path, entry.name)
            return await dynamicImport(fullPath)
          })
        )
      })
    })

    await promiseAll(promises)

    logger.debug(`Workflows registered.`)
  }
}
