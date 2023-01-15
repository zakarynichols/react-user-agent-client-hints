export interface NavigatorUABrandVersion {
  brand: string
  version: string
}

export interface UADataValues {
  brands: NavigatorUABrandVersion[]
  mobile: boolean
  architecture: string
  bitness: string
  model: string
  platform: string
  platformVersion: string
  uaFullVersion: string
  wow64: boolean
  fullVersionList: NavigatorUABrandVersion[]
}

export interface UALowEntropyJSON {
  brands: NavigatorUABrandVersion[]
  mobile: boolean
  platform: string
}

export interface NavigatorUAData {
  readonly brands: NavigatorUABrandVersion[]
  readonly mobile: boolean
  readonly platform: string
  getHighEntropyValues(hints: string[]): Promise<UADataValues>
  toJSON(): UALowEntropyJSON
}

export interface NavigatorUA {
  readonly userAgentData: NavigatorUAData
}
