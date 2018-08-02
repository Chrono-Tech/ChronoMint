/**
 * Get file name from url and local path
 */
export function getFileNameFromPath (path): string {
  return path && path.replace(/^.*[\\\/]/, '') || ''
}
