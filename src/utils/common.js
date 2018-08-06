/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * Get file name from url and local path
 */
export function getFileNameFromPath (path): string {
  return path && path.replace(/^.*[\\\/]/, '') || ''
}
