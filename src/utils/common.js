/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * Get file name from url and local path
 */
export function getFileNameFromPath (path): string {
  // eslint-disable-next-line no-useless-escape
  return path && path.replace(/^.*[\\\/]/, '') || ''
}
