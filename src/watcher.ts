import * as vscode from 'vscode'
import * as chokidar from 'chokidar'
import * as path from 'path'
import * as fs from 'fs'

import { updateIndexFile } from './updateIndexFile'
import { updateStatusBarItem } from './extension'

export let watchers: chokidar.FSWatcher[] = []
export let watchedPaths: Set<string> = new Set()

export const enableFileWatcher = (type: 'enabled' | 'updated') => {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return

  workspaceFolders.forEach(folder => {
    const vscodeDir = path.join(folder.uri.fsPath, '.vscode')

    if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir)
    // add config-files to watcher
    const fullWatchPath = path.join(vscodeDir, '*IndexConfig.json')

    if (!watchedPaths.has(fullWatchPath)) {
      const watcher = chokidar.watch(fullWatchPath, {
        persistent: true,
      })

      watcher
        .on('add', () => enableFileWatcher('updated'))
        .on('change', () => enableFileWatcher('updated'))
        .on('unlink', () => enableFileWatcher('updated'))

      watchers.push(watcher)
      watchedPaths.add(fullWatchPath)
    }

    fs.readdir(vscodeDir, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage(
          `Error reading .vscode directory: ${err.message}`
        )
        console.error('Error reading .vscode directory:', err)
        return
      }

      const configFiles = files.filter(file =>
        file.endsWith('IndexConfig.json')
      )

      if (configFiles.length <= 0) {
        const errMsg = 'No config-file found in .vscode directory.'
        vscode.window.showWarningMessage(errMsg)
        console.error(errMsg)
        return
      }

      configFiles.forEach(configFile => {
        const configPath = path.join(vscodeDir, configFile)
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

        const fullWatchPath = path.join(
          folder.uri.fsPath,
          config.watchPath,
          `*.${config.watchFileType}`
        )

        if (!watchedPaths.has(fullWatchPath)) {
          const watcher = chokidar.watch(fullWatchPath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
          })

          watcher
            .on('add', () => updateIndexFile(config, folder.uri.fsPath))
            .on('unlink', filePath =>
              updateIndexFile(config, folder.uri.fsPath, filePath)
            )

          watchers.push(watcher)
          watchedPaths.add(fullWatchPath)
        }

        console.log(`Watch path already added: ${fullWatchPath}`)

        updateStatusBarItem()
        updateIndexFile(config, folder.uri.fsPath)
      })
    })
  })

  vscode.window.showInformationMessage(`File watcher ${type}.`)
  console.log(`File watcher ${type}.`)
}

export const disableFileWatcher = () => {
  watchers.forEach(watcher => watcher.close())
  watchers = []
  watchedPaths.clear()
  updateStatusBarItem()
  vscode.window.showInformationMessage('File watcher disabled.')
  console.log('Watcher disabled.')
}
