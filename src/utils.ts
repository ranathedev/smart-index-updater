import * as path from 'path'

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
