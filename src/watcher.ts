import * as vscode from 'vscode'
import * as chokidar from 'chokidar'
import * as path from 'path'
import * as fs from 'fs'

import { updateIndexFile } from './updateIndexFile'
import { updateStatusBarItem } from './extension'

export let watchers: chokidar.FSWatcher[] = []
export let watchedPaths: Set<string> = new Set()

export const enableFileWatcher = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) return

  workspaceFolders.forEach(folder => {
    const vscodeDir = path.join(folder.uri.fsPath, '.vscode')

    // add vscodeDir to watcher
    const fullWatchPath = path.join(vscodeDir, '*IndexConfig.json')
    console.log('fullWatchPath', fullWatchPath)

    if (!watchedPaths.has(fullWatchPath)) {
      const watcher = chokidar.watch(fullWatchPath, {
        // ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
      })

      watcher
        .on('add', () => {
          enableFileWatcher()
          vscode.window.showInformationMessage('File watcher updated.')
          console.log('Watcher updated.')
        })
        .on('change', () => {
          enableFileWatcher()
          vscode.window.showInformationMessage('File watcher updated.')
          console.log('Watcher updated.')
        })
        .on('unlink', () => {
          enableFileWatcher()
          vscode.window.showInformationMessage('File watcher updated.')
          console.log('Watcher updated.')
        })

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
      })
    })
  })
}

export const disableFileWatcher = () => {
  watchers.forEach(watcher => watcher.close())
  watchers = []
  watchedPaths.clear()
  updateStatusBarItem()
  vscode.window.showInformationMessage('File watcher disabled.')
  console.log('Watcher disabled.')
}
