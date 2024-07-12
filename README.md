# Smart Index Updater

## Overview

This VS Code extension enhances developer productivity by automating the management of index files within projects. It leverages `chokidar` for file system monitoring and dynamically updates index files based on changes to specified configuration files (`*IndexConfig.json`). The extension is particularly useful for maintaining consistency in large-scale projects where module or resource indexing is critical.

## Key Features

- **Automatic Index Updating**: Monitors and updates index files (index.ts) when configuration files (`\*IndexConfig.json`) change.
- **Flexible Configuration**: Supports multiple project-specific configurations for watching different types of files or directories.
- **Enhanced Developer Workflow**: Reduces manual effort in maintaining `import/export` declarations, ensuring codebase integrity and efficiency.
- **Status Bar Integration**: Provides visual feedback through the status bar, indicating the current state of file watching (`On/Off`).

## Use Cases

- **Large-scale Projects:** Facilitates seamless management of module imports across complex project structures.
- **Resource Directories:** Automatically updates asset or resource indexing files based on changes.

## Getting Started

1. **Install the Extension**: Get it from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=evonare.smart-index-updater).
2. **Configuration**: Define `*IndexConfig.json` files within your project's `.vscode` directory to specify watched paths and file types.
3. **Enable Watcher**: The watcher is enabled automatically when the startup is finished. It can also be enabled manually from the command palette or the status bar item.
4. **Add Path to Watch**: Open the command palette and select "Add Path to Watch" to specify a new directory path to monitor.
5. **Create Index**: Open the command palette and select "Create Index". This command is also available in the context menu when right-clicking on a folder in the Explorer view.

### Usage Notes

- If no `watch file-type` is entered, the default value will be set to `*(any)`.
- If no `config file-title` is entered, the default value will be set to `module`. If the file name already exists, it will be `module-(increment)`, such as `module-1IndexConfig.json`, `module-2IndexConfig.json`, etc.
- If no `index file-type` is entered, the default value will be set to `ts`, such as `index.ts`.

### Configuring Watch Paths

**Configuration Files:** Create one or more configuration files (e.g., `modulesIndexConfig.json`, `imagesIndexConfig.json`) within the .vscode directory of your project to specify the directories and file types to watch.
**Format:** Each configuration file should define the `watchPath`, `indexFile`, `watchFileType` and `excludeFileTypes`.

#### Example

`{"watchPath": "assets/modules",
"indexFile": "assets/modules/index.ts",
"watchFileType": "*",
"excludeFileTypes": ["js"]}`

## Requirements

- Visual Studio Code version 1.91.0 or higher.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for "Smart Index Updater"
4. Click Install.

## Release Notes

### 1.0.0

Initial release of the Smart Index Updater.

## License

This extension is licensed under the [MIT License](https://github.com/ranathedev/smart-index-updater/blob/main/LICENSE).

## Author

This extension was created by [Rana Intizar](https://proxar.ranaintizar.com/me/github).

## Support

- [Email:](mailto:meetranaintizar@gmail.com) `meetranaintizar@gmail.com`
