import { FetchError as OFetchError, ofetch, FetchOptions as OFetchOptions } from "ofetch"

export type FetchOptions = {
  baseURLs?: string[] | undefined
} & Omit<OFetchOptions, "baseURL">

export type CosmosFetch = <T>(url: string, options?: OFetchOptions<"json", any> | undefined) => Promise<T>

export function createFetch(options?: FetchOptions): CosmosFetch {
  let remaining = options?.baseURLs?.length ?? 1
  let baseURL = options?.baseURLs?.[0] ?? undefined
  const fetch = ofetch.create({ ...options, baseURL })

  const next = (error: unknown) => {
    remaining--
    if (!remaining) {
      throw error
    }

    baseURL = options?.baseURLs?.[options.baseURLs?.length - remaining] ?? undefined
    return
  }

  return async function _fetch<T>(
    url: string,
    options?: OFetchOptions<"json", any> | undefined
  ): Promise<T> {
    return fetch<T>(url, { ...options, baseURL }).catch((error) => {
      if (error instanceof OFetchError) {
        // eslint-disable-next-line unicorn/no-lonely-if
        if (!error.response || (error.response && error.response.status >= 500)) {
          next(error)

          return _fetch<T>(url, options)
        }
      }

      throw error
    })
  }
}