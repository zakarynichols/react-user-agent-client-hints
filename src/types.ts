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

export function isUADataValues(params: UADataValues): params is UADataValues {
  return (
    typeof params.architecture === "string" &&
    typeof params.mobile === "boolean" &&
    typeof params.platform === "string" &&
    typeof params.bitness === "string" &&
    Array.isArray(params.brands) &&
    typeof params.model === "string" &&
    typeof params.platformVersion === "string"
  )
}

export function isUALowEntropyJSON(
  params: UALowEntropyJSON
): params is UALowEntropyJSON {
  return (
    typeof params.mobile === "boolean" &&
    typeof params.platform === "string" &&
    Array.isArray(params.brands)
  )
}
