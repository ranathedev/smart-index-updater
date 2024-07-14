import * as path from 'path'
import * as fs from 'fs'

export const removeExtFromFilename = (filename: string) => {
  const parts = filename.split('.')
  if (parts.length > 1) {
    parts.pop() // Remove the last part (the extension)
    return parts.join('.')
  }
  return filename // No extension found
}

export const getExtFromFilename = (filename: string): string =>
  path.extname(filename).slice(1)

export const getExcludedFileTypes = (str: string) =>
  str
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '')

export const isDirectory = (watchPath: string, item: string) => {
  const itemPath = path.join(watchPath, item)
  return fs.lstatSync(itemPath).isDirectory()
}
