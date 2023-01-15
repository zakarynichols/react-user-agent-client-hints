import { useEffect, useState } from "react"
import { UADataValues, UALowEntropyJSON, NavigatorUA } from "../userAgentData"

type Hint =
  | "brand"
  | "model"
  | "version"
  | "architecture"
  | "platform"
  | "mobile"
  | "platformVersion"
  | "uaFullVersion"
  | "bitness"
  | "wow64"
  | "fullVersionList"

export function useUserAgentData(hints: Hint[]): UADataValues | Error {
  const [userAgentData, setUserAgentData] = useState<UADataValues | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function getHighEntropyUAData(): Promise<void> {
      try {
        if (!isNavigatorUA(navigator)) {
          setError(
            new Error(
              "High entropy user agent data not available in this browser"
            )
          )
          return
        }
        // check if the `navigator.userAgentData` object is available
        if (navigator.userAgentData === undefined) {
          setError(new Error("User-agent client hints API is undefined."))
          return
        }
        // check if the user has granted permission for the client hints
        if (navigator.userAgentData.getHighEntropyValues === undefined) {
          setError(new Error("Permission denied accessing user-agent data"))
          return
        }
        // request the high entropy values
        const agentData = await navigator.userAgentData.getHighEntropyValues(
          hints
        )
        setUserAgentData(agentData)
      } catch (err) {
        setError(new Error("Failed to get user-agent data"))
      }
    }
    getHighEntropyUAData()
  }, [hints])

  if (error instanceof Error) return error

  if (userAgentData !== null) return userAgentData

  return new Error("Failed to run hook")
}

export function getLowEntropyUserAgentData(): UALowEntropyJSON | void {
  if (!isNavigatorUA(navigator)) return
  if (navigator.userAgentData === undefined) return
  return navigator.userAgentData.toJSON()
}

export function isNavigatorUA(navigator: unknown): navigator is NavigatorUA {
  return navigator instanceof Navigator && "userAgentData" in navigator
}
