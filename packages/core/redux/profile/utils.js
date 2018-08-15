/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

export const getRequestConfigWithAuthorization = (bearer: string, config = {}) => ({
  ...config.headers,
  Authorization: `Bearer ${bearer}`,
})

export const getPostConfigWithAuthorizationSignature = (signature: string, config = {}) => ({
  ...config.headers,
  Authorization: `Signature ${signature}`,
})
