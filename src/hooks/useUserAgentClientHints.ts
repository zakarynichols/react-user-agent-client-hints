import { useEffect, useReducer, useState } from "react"
import { UADataValues, UALowEntropyJSON } from "../types"

export type Hint =
  | "architecture"
  | "model"
  | "bitness"
  | "platformVersion"
  | "fullVersionList"

type HighEntropy = "high"
type LowEntropy = "low"

const HIGH_ENTROPY: HighEntropy = "high"
const LOW_ENTROPY: LowEntropy = "low"

export function useUserAgentClientHints(params: {
  entropy: HighEntropy
  hints: Hint[]
}): UADataValues
export function useUserAgentClientHints(params: {
  entropy: LowEntropy
}): UALowEntropyJSON
export function useUserAgentClientHints(): UALowEntropyJSON

/**
 * Type-safe hook for accessing the current browser and operating system information.
 * @param entropy Amount of information this hook reveals about the browser.
 * @param hints Collection of strongly typed strings hinting to the returned user-agent data.
 * @returns User agent data mapped from the hints argument or an error.
 * @throws
 */
export function useUserAgentClientHints(params?: {
  entropy: HighEntropy | LowEntropy
  hints?: Hint[]
}): UADataValues | UALowEntropyJSON {
  const [error, setError] = useState<null | Error>(null)

  const [state, dispatch] = useReducer(userAgentReducer, initState)

  useEffect(() => {
    async function getUserAgentData(): Promise<void> {
      switch (params?.entropy) {
        case HIGH_ENTROPY: {
          if (params.hints === undefined) {
            setError(new Error("Cannot have high entropy and no hints."))
            return
          }

          const data = await getHighEntropyUserAgentData(params.hints)

          if (data instanceof Error) {
            setError(data)
            break
          }

          dispatch({ type: HIGH_ENTROPY, payload: data })
          break
        }
        case LOW_ENTROPY: {
          const data = getLowEntropyUserAgentData()
          dispatch({ type: LOW_ENTROPY, payload: data })
          break
        }
        case undefined: {
          const data = getLowEntropyUserAgentData()
          dispatch({ type: LOW_ENTROPY, payload: data })
          break
        }
        default: {
          setError(new Error("An unexpected case has been encountered."))
          break
        }
      }
    }
    void getUserAgentData()
  }, [params?.entropy, params?.hints])

  if (error instanceof Error) throw error

  return state
}

async function getHighEntropyUserAgentData(
  hints: Hint[]
): Promise<UADataValues | Error> {
  try {
    const agentData = await navigator.userAgentData?.getHighEntropyValues(hints)

    if (agentData === undefined) {
      return new Error("Could not return user-agent data.")
    }

    return agentData
  } catch (err: unknown) {
    if (!(err instanceof Error))
      throw new Error("An unexpected error has occurred.")

    if (err.name === "NotAllowedError") {
      return new Error("Permission denied accessing user-agent data.")
    }

    return err
  }
}

function getLowEntropyUserAgentData(): UALowEntropyJSON {
  if (navigator.userAgentData === undefined)
    throw new Error("Client does not have user-agent data.")
  return navigator.userAgentData.toJSON()
}

const initState: UADataValues | UALowEntropyJSON = {}

function userAgentReducer(
  state: UADataValues | UALowEntropyJSON,
  action: {
    type: HighEntropy | LowEntropy
    payload: UADataValues | UALowEntropyJSON
  }
): UADataValues | UALowEntropyJSON {
  switch (action.type) {
    case HIGH_ENTROPY: {
      return { ...state, ...action.payload }
    }
    case LOW_ENTROPY: {
      return { ...state, ...action.payload }
    }
    default:
      throw new Error("An unexpected case has been reached.")
  }
}
