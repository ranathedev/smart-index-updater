import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { getExcludedFileTypes } from './utils'
import { addPath } from './addPath'
import { updateIndex } from './updateIndex'

export const createIndex = async (uri: any) => {
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath
    let folderPath = ''

    if (uri) {
      // Check if the URI represents a folder
      if (uri.scheme === 'file' && uri.fsPath) {
        // Get the path of the folder
        folderPath = uri.fsPath
      }
    }

    const watchPath = folderPath

    let indexFileType = await vscode.window.showInputBox({
      prompt: 'Enter the index file-type.',
      placeHolder: 'e.g., js | ts | jsx | tsx',
    })

    if (typeof indexFileType === 'undefined') return
    if (indexFileType === '') indexFileType = 'ts'

    let excludeTypes = await vscode.window.showInputBox({
      prompt:
        'Would you like to exclude any file-types? Add comma-separated file-types',
      placeHolder: 'e.g., mjs, ejs, jsx, tsx',
    })

    let excludeFileTypes = []
    if (typeof excludeTypes === 'undefined') return
    if (excludeTypes === '') excludeFileTypes = []
    excludeFileTypes = getExcludedFileTypes(excludeTypes)

    const indexFile = path.join(watchPath, 'index.' + indexFileType)

    fs.readdir(watchPath, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage(
          `Error reading directory ${watchPath}: ${err.message}`
        )
        console.error(`Error reading directory ${watchPath}:`, err)
        return
      }

      updateIndex(
        files,
        { excludeFileTypes, watchFileType: '*' },
        indexFile,
        false
      )
    })

    // addPath to watcher
    const relativePath = path.relative(workspacePath, folderPath)
    const relativeIndexFilePath = path.relative(workspacePath, indexFile)
    const configData = {
      watchPath: relativePath,
      indexFile: relativeIndexFilePath,
      watchFileType: '*',
      fileTitle: 'modules',
      excludeFileTypes,
    }
    await addPath(null, configData)
  } else return vscode.window.showErrorMessage('No workspace is open.')
}
