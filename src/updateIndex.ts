import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { getExtFromFilename, isDirectory, removeExtFromFilename } from './utils'
import { Config } from './types'

export const updateIndex = (
  watchPath: string,
  items: string[],
  config: Config,
  indexFile: string,
  checkValidTypes: boolean = false
) => {
  const exports = items
    .filter(item => {
      const isIndexFile = item === path.basename(indexFile)

      // Check if the item is a directory and if it should be excluded
      if (isDirectory(watchPath, item))
        return !config.excludeDirectories.includes(item)
      const isExcludedFileType = config.excludeFileTypes.includes(
        getExtFromFilename(path.basename(item))
      )
      if (checkValidTypes) {
        const isValidFileType =
          config.watchFileType === '*' ||
          item.endsWith(`.${config.watchFileType}`)
        return !isIndexFile && isValidFileType && !isExcludedFileType
      }
      return !isIndexFile && !isExcludedFileType
    })
    .map(file => `export * from './${removeExtFromFilename(file)}';`)
    .join('\n')

  fs.writeFile(indexFile, exports, err => {
    if (err) {
      vscode.window.showErrorMessage(
        `Error writing index file ${indexFile}: ${err.message}`
      )
      console.error(`Error writing index file ${indexFile}:`, err)
      return
    }
    console.log('Index file updated.')
  })
}
