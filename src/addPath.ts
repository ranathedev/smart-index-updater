import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

import { watchedPaths } from './watcher'
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

    if (uri) {
      workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath

      // Check if the URI represents a folder
      if (uri.scheme === 'file' && uri.fsPath) {
        // Get the path of the folder
        const folderPath = uri.fsPath
        relativePath = path.relative(workspacePath, folderPath)
      }

      const watchPath = await vscode.window.showInputBox({
        prompt: 'Enter the path to watch',
        placeHolder: 'e.g., src/lib/modules',
        value: relativePath,
      })

      if (typeof watchPath === 'undefined') return
      if (watchPath === '')
        return vscode.window.showErrorMessage('No watch path entered.')

      let indexFileType = await vscode.window.showInputBox({
        prompt: 'Enter the index file-type.',
        placeHolder: 'e.g., js | ts | jsx | tsx',
      })

      if (typeof indexFileType === 'undefined') return
      if (indexFileType === '') indexFileType = 'ts'
      const indexFile = watchPath + '/index.' + indexFileType

      let watchFileType = await vscode.window.showInputBox({
        prompt: 'Enter the file-type to watch',
        placeHolder: 'e.g., js | ts | jsx | tsx | *',
      })

      if (typeof watchFileType === 'undefined') return
      if (watchFileType === '') watchFileType = '*'

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
      if (excludeTypes === '') excludeFileTypes = []
      excludeFileTypes = getExcludedFileTypes(excludeTypes)

      configFileTitle = await vscode.window.showInputBox({
        prompt: 'Enter the config-file-name',
        placeHolder: 'e.g., modules | icons | hooks',
      })

      if (typeof configFileTitle === 'undefined') return
      if (configFileTitle === '') configFileTitle = 'module'

      config = { watchPath, indexFile, watchFileType, excludeFileTypes }
    } else {
      config = {
        watchPath: configData.watchPath,
        indexFile: configData.indexFile,
        watchFileType: configData.watchFileType,
        excludeFileTypes: configData.excludeFileTypes,
      }
      configFileTitle = configData.fileTitle
    }

    const vscodeDir = path.join(
      vscode.workspace.workspaceFolders[0].uri.fsPath,
      '.vscode'
    )

    let configFile = path.join(vscodeDir, configFileTitle + 'IndexConfig.json')
    let counter = 1

    // Check if the file exists and increment the suffix if it does
    while (fs.existsSync(configFile)) {
      configFile = path.join(
        vscodeDir,
        `${configFileTitle}-${counter}IndexConfig.json`
      )
      counter++
    }

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
      !!uri ? 'Path Added.' : 'Index created.'
    )
  } else return vscode.window.showErrorMessage('No workspace is open.')
}
