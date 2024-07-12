import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { updateIndex } from './updateIndex'
import { Config } from './types'

export const updateIndexFile = (
  config: Config,
  basePath: string,
  filePath?: string
) => {
  const watchPath = path.join(basePath, config.watchPath)
  const indexFile = path.join(basePath, config.indexFile)
  if (filePath !== indexFile) {
    fs.readdir(watchPath, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage(
          `Error reading directory ${watchPath}: ${err.message}`
        )
        console.error(`Error reading directory ${watchPath}:`, err)
        return
      }

      updateIndex(files, config, indexFile, true)
    })
  }
}
