# Change Log

## [1.0.2] - 2024-07-13

### Added

- Improved updateIndexFile function to include directories in the export statements.
- Added support for excluding specific directories based on the `config.excludeDirectories` setting.

### Fixed

- Ensured that directories are correctly included in the exports when applicable.
- Handled exclusion of specified directories from the index file update process.

This release enhances the functionality of the index file updater by correctly managing directories and excluding specified ones, streamlining the process and ensuring accurate exports.

## [1.0.1] 2024-07-13

### Fixed

- Corrected an issue where the command `addPath` was not functioning as expected.

## [1.0.0] - 2024-07-13

Initial release of the Smart Index Updater.
