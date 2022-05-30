/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// https://wicg.github.io/ua-client-hints/#dictdef-navigatoruabrandversion
export interface NavigatorUABrandVersion {
  readonly brand: string
  readonly version: string
}

// https://wicg.github.io/ua-client-hints/#dictdef-uadatavalues
export interface UADataValues {
  readonly brands?: NavigatorUABrandVersion[]
  readonly mobile?: boolean
  readonly platform?: string
  readonly architecture?: string
  readonly bitness?: string
  readonly model?: string
  readonly platformVersion?: string
  readonly fullVersionList?: NavigatorUABrandVersion[]
}

// https://wicg.github.io/ua-client-hints/#dictdef-ualowentropyjson
export interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
}

export type Hint =
  | "architecture"
  | "model"
  | "bitness"
  | "platformVersion"
  | "fullVersionList"
  | "uaFullVersion"

export type HighEntropy = "high"

export type LowEntropy = "low"

// function hasKey<K extends string, T extends object>(
//   k: K,
//   o: T
// ): o is T & Record<K, unknown> {
//   return k in o
// }

function isDefined<T>(params: T): params is T {
  return params !== undefined
}

export function isUADataValues(params: any): params is UADataValues {
  return (
    params !== null &&
    typeof params === "object" &&
    (!isDefined(params.brands) || Array.isArray(params.brands)) &&
    (!isDefined(params.mobile) || typeof params.mobile === "boolean") &&
    (!isDefined(params.platform) || typeof params.platform === "string") &&
    (!isDefined(params.architecture) ||
      typeof params.architecture === "string") &&
    (!isDefined(params.bitness) || typeof params.bitness === "string") &&
    (!isDefined(params.model) || typeof params.model === "string") &&
    (!isDefined(params.platformVersion) ||
      typeof params.platformVersion === "string") &&
    (!isDefined(params.fullVersionList) ||
      Array.isArray(params.fullVersionList))
  )
}

export function isUALowEntropyJSON(params: any): params is UALowEntropyJSON {
  return (
    params !== null &&
    typeof params === "object" &&
    (!isDefined(params.brands) || Array.isArray(params.brands)) &&
    (!isDefined(params.mobile) || typeof params.mobile === "boolean") &&
    (!isDefined(params.platform) || typeof params.platform === "string")
  )
}
