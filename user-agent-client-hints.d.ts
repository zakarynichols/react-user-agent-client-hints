/**
 * ua-client-hints interface spec: https://wicg.github.io/ua-client-hints/#interface
 */

// https://wicg.github.io/ua-client-hints/#dictdef-navigatoruabrandversion
interface NavigatorUABrandVersion {
  readonly brand: string
  readonly version: string
}

// https://wicg.github.io/ua-client-hints/#dictdef-uadatavalues
interface UADataValues {
  readonly brands?: NavigatorUABrandVersion[]
  readonly mobile?: boolean
  readonly platform?: string
  readonly architecture?: string
  readonly bitness?: string
  readonly model?: string
  readonly platformVersion?: string
  readonly uaFullVersion?: string // deprecated in favor of fullVersionList
}

// https://wicg.github.io/ua-client-hints/#dictdef-ualowentropyjson
interface UALowEntropyJSON {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
}

// https://wicg.github.io/ua-client-hints/#navigatoruadata
interface NavigatorUAData extends UALowEntropyJSON {
  getHighEntropyValues(hints: string[]): Promise<UADataValues>
  toJSON(): UALowEntropyJSON
}

// https://wicg.github.io/ua-client-hints/#navigatorua
interface NavigatorUA {
  readonly userAgentData?: NavigatorUAData
}

// Complete https://wicg.github.io/ua-client-hints/#interface
interface Navigator extends NavigatorUA {}
interface WorkerNavigator extends NavigatorUA {}
