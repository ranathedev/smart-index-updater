import * as vscode from 'vscode'
import * as path from 'path'

import { getExcludedFileTypes } from './utils'
import { addPath } from './addPath'

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
    } else {
      const watchPath = await vscode.window.showInputBox({
        prompt: 'Enter the path to watch',
        placeHolder: 'e.g., src/lib/modules',
      })

      if (typeof watchPath === 'undefined') return
      if (watchPath === '')
        return vscode.window.showErrorMessage('No watch path entered.')

      folderPath = path.join(workspacePath, watchPath)
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
    const relativePath = path.relative(workspacePath, folderPath)
    const relativeIndexFilePath = path.relative(workspacePath, indexFile)
    const configData = {
      watchPath: relativePath,
      indexFile: relativeIndexFilePath,
      watchFileType: '*',
      fileTitle: 'modules',
      excludeFileTypes,
    }

    addPath(null, configData)
  } else return vscode.window.showErrorMessage('No workspace is open.')
}
