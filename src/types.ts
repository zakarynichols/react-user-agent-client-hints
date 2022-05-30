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
  readonly uaFullVersion?: string
}

// https://wicg.github.io/ua-client-hints/#dictdef-ualowentropyjson
export interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
}

function hasKey<K extends string, T extends object>(
  k: K,
  o: T
): o is T & Record<K, unknown> {
  return k in o
}

export function isUADataValues(params: unknown): params is UADataValues {
  return (
    typeof params === "object" &&
    params !== null &&
    hasKey("architecture", params) &&
    typeof params.architecture === "string" &&
    hasKey("mobile", params) &&
    typeof params.mobile === "boolean" &&
    hasKey("platform", params) &&
    typeof params.platform === "string" &&
    hasKey("bitness", params) &&
    typeof params.bitness === "string" &&
    hasKey("brands", params) &&
    Array.isArray(params.brands) &&
    params.brands.every(
      (brand: NavigatorUABrandVersion) => brand.brand && brand.version
    ) &&
    hasKey("model", params) &&
    typeof params.model === "string" &&
    hasKey("platformVersion", params) &&
    typeof params.platformVersion === "string"
  )
}

export function isUALowEntropyJSON(
  params: unknown
): params is UALowEntropyJSON {
  return (
    typeof params === "object" &&
    params !== null &&
    hasKey("brands", params) &&
    Array.isArray(params.brands) &&
    params.brands.every(
      (brand: NavigatorUABrandVersion) => brand.brand && brand.version
    ) &&
    hasKey("mobile", params) &&
    typeof params.mobile === "boolean" &&
    hasKey("platform", params) &&
    typeof params.platform === "string"
  )
}
