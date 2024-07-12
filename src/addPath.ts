import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { watchedPaths, enableFileWatcher } from './watcher'
import { Config } from './types'
import { getExcludedFileTypes } from './utils'

export const addPath = async (uri?: any, configData?: any) => {
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    let configFileTitle
    let config: Config

    let workspacePath
    let relativePath = ''

    if (configData) {
      config = {
        watchPath: configData.watchPath,
        indexFile: configData.indexFile,
        watchFileType: configData.watchFileType,
        excludeFileTypes: configData.excludeFileTypes,
      }
      configFileTitle = configData.fileTitle
    } else {
      workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath

      if (uri) {
        // Check if the URI represents a folder
        if (uri.scheme === 'file' && uri.fsPath) {
          // Get the path of the folder
          const folderPath = uri.fsPath
          relativePath = path.relative(workspacePath, folderPath)
        }
      }

      const watchPath = await vscode.window.showInputBox({
        prompt: 'Enter the path watcher',
        placeHolder: 'e.g., src/lib/modules',
        value: relativePath,
      })

      if (typeof watchPath === 'undefined') return
      if (watchPath === '')
        return vscode.window.showErrorMessage('No watch path entered.')

      const indexFile = await vscode.window.showInputBox({
        prompt: 'Enter the index file path',
        placeHolder: 'e.g., src/lib/modules/index.ts',
        value: relativePath + '/index.ts',
      })

      if (typeof indexFile === 'undefined') return
      if (indexFile === '')
        return vscode.window.showErrorMessage('Index file path not entered.')

      const watchFileType = await vscode.window.showInputBox({
        prompt: 'Enter the file-type to watch',
        placeHolder: 'e.g., js | ts | jsx | tsx | *',
      })

      if (typeof watchFileType === 'undefined') return
      if (watchFileType === '')
        return vscode.window.showErrorMessage('Watch file-type not entered.')

      const fullWatchPath = path.join(
        vscode.workspace.workspaceFolders[0].uri.fsPath,
        watchPath,
        `*.${watchFileType}`
      )

      if (watchedPaths.has(fullWatchPath)) {
        vscode.window.showWarningMessage(
          `Watch path already added: ${fullWatchPath}`
        )
        return
      }

      let excludeTypes = await vscode.window.showInputBox({
        prompt:
          'Would you like to exclude any file-types? Add comma-separated file-types',
        placeHolder: 'e.g., mjs, ejs, jsx, tsx',
      })

      let excludeFileTypes = []
      if (typeof excludeTypes === 'undefined') return
      if (excludeTypes === '') excludeFileTypes = ['']
      excludeFileTypes = getExcludedFileTypes(excludeTypes)

      configFileTitle = await vscode.window.showInputBox({
        prompt: 'Enter the config-file-name',
        placeHolder: 'e.g., modules | icons | hooks',
      })

      if (typeof configFileTitle === 'undefined') return
      if (configFileTitle === '') configFileTitle = 'module'

      config = { watchPath, indexFile, watchFileType, excludeFileTypes }
    }

    const vscodeDir = path.join(
      vscode.workspace.workspaceFolders[0].uri.fsPath,
      '.vscode'
    )
    const configFile = path.join(
      vscodeDir,
      configFileTitle + 'IndexConfig.json'
    )

    fs.writeFile(configFile, JSON.stringify(config), err => {
      if (err) {
        vscode.window.showErrorMessage(
          `Error writing config file ${configFile}: ${err.message}`
        )
        console.error(`Error writing index file ${config.indexFile}:`, err)
        return
      }
      console.log('Config file added.')
    })

    vscode.window.showInformationMessage(
      configData ? 'Index created.' : 'Path Added.'
    )
    enableFileWatcher()
    vscode.window.showInformationMessage('File watcher updated.')
    console.log('File watcher updated.')
  } else return vscode.window.showErrorMessage('No workspace is open.')
}
