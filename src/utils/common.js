/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * Get file name from url and local path
 */
export function getFileNameFromPath (path): string {
  // eslint-disable-next-line no-useless-escape
  return path && path.replace(/^.*[\\\/]/, '') || ''
}

/**
 * Predicate for filtering empty entry objects
 * @param entry Entry key value array
 */
export function isEntryNotEmptyObject ([,value]: [string, any]) {
  if (typeof value !== 'object') return
  if (!Object.keys(value).length) return
  return true
}
