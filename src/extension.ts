import * as vscode from 'vscode'

import { watchers, enableFileWatcher, disableFileWatcher } from './watcher'
import { addPath } from './addPath'
import { createIndex } from './createIndex'

let statusBarItem: vscode.StatusBarItem

export function activate(context: vscode.ExtensionContext) {
  // enable file watcher on load
  enableFileWatcher()
  vscode.window.showInformationMessage('File watcher enabled.')
  console.log('File watcher enabled.')

  const enableWatcherCmd = vscode.commands.registerCommand(
    'smart-index-updater.enable',
    () => {
      enableFileWatcher()
      vscode.window.showInformationMessage('File watcher enabled.')
      console.log('File watcher enabled.')
    }
  )

  const disableWatcherCmd = vscode.commands.registerCommand(
    'smart-index-updater.disable',
    disableFileWatcher
  )

  const addPathCmd = vscode.commands.registerCommand(
    `smart-index-updater.addPath`,
    async uri => {
      await addPath(uri)
    }
  )

  const toggleWatcherCmd = vscode.commands.registerCommand(
    'smart-index-updater.toggleFileWatcher',
    () => {
      if (watchers.length > 0) disableFileWatcher()
      else {
        enableFileWatcher()
        vscode.window.showInformationMessage('File watcher enabled.')
        console.log('File watcher enabled.')
      }
    }
  )

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  )
  statusBarItem.command = 'smart-index-updater.toggleFileWatcher'

  const createIndexCmd = vscode.commands.registerCommand(
    `smart-index-updater.createIndex`,
    createIndex
  )

  context.subscriptions.push(
    enableWatcherCmd,
    disableWatcherCmd,
    addPathCmd,
    statusBarItem,
    toggleWatcherCmd,
    createIndexCmd
  )

  updateStatusBarItem()
}

export const updateStatusBarItem = () => {
  if (statusBarItem) {
    if (watchers.length > 0) statusBarItem.text = '$(eye) File Watcher: On'
    if (watchers.length <= 0)
      statusBarItem.text = '$(eye-closed) File Watcher: Off'

    statusBarItem.show()
  }
}

export function deactivate() {
  disableFileWatcher()
}
