import { useEffect, useState } from "react"

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

export function useUserAgentData(
  hints: Hint[]
): [UADataValues | null, Error | null] {
  const [userAgentData, setUserAgentData] = useState<UADataValues | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function getHighEntropyUAData(): Promise<void> {
      try {
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

  return [userAgentData, error]
}

function getLowEntropyUserAgentData(): UALowEntropyJSON | void {
  if (navigator.userAgentData === undefined) return
  return navigator.userAgentData.toJSON()
}
