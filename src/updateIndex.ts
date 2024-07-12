import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { getExtFromFilename, removeExtFromFilename } from './utils'

export const updateIndex = (
  files: string[],
  config: { excludeFileTypes: string[]; watchFileType: string },
  indexFile: string,
  checkValidTypes: boolean = false
) => {
  const exports = files
    .filter(file => {
      const isIndexFile = file === path.basename(indexFile)
      const isExcludedFileType = config.excludeFileTypes.includes(
        getExtFromFilename(path.basename(file))
      )
      if (checkValidTypes) {
        const isValidFileType =
          config.watchFileType === '*' ||
          file.endsWith(`.${config.watchFileType}`)
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
