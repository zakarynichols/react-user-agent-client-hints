import { useEffect, useReducer, useState } from "react"
import {
  HighEntropy,
  Hint,
  isUADataValues,
  isUALowEntropyJSON,
  LowEntropy,
  UADataValues,
  UALowEntropyJSON
} from "../types"

const HIGH_ENTROPY: HighEntropy = "high"
const LOW_ENTROPY: LowEntropy = "low"

const notAllowedErrorName = "NotAllowedError"

const errors = {
  highEntropyAndNoHints: "Cannot have high entropy and no hints.",
  unexpectedErrorOccurred: "An unexpected error has been occurred.",
  userAgentApiUndefined: "User-agent client hints API is undefined.",
  permissionDenied: "Permission denied accessing user-agent data."
}

/**
 * Overloads to help infer the correct return type.
 */
function useUserAgentClientHints(params: {
  entropy: HighEntropy
  hints: Hint[]
}): UADataValues | Error
function useUserAgentClientHints(params: {
  entropy: LowEntropy
}): UALowEntropyJSON | Error
function useUserAgentClientHints(): UALowEntropyJSON | Error

/**
 * Type-safe hook for accessing the current browser and operating system information.
 * @param entropy Amount of information this hook reveals about the browser.
 * @param hints Collection of strongly typed strings hinting to the returned user-agent data.
 * @returns User agent data mapped from the hints argument or an error.
 */
function useUserAgentClientHints(params?: {
  entropy: HighEntropy | LowEntropy
  hints?: Hint[]
}): UADataValues | UALowEntropyJSON | Error {
  const [error, setError] = useState<Error | null>(null)
  const [state, dispatch] = useReducer(userAgentReducer, initState)

  useEffect(() => {
    async function getUserAgentData(): Promise<void> {
      switch (params?.entropy) {
        case HIGH_ENTROPY: {
          if (params.hints === undefined) {
            throw new Error(errors.highEntropyAndNoHints)
          }

          const data = await getHighEntropyUserAgentData(params.hints)

          if (isUADataValues(data)) {
            console.log(data)
            dispatch({ type: HIGH_ENTROPY, payload: data })
          }
          break
        }
        case LOW_ENTROPY: {
          const data = getLowEntropyUserAgentData()

          if (isUALowEntropyJSON(data)) {
            dispatch({ type: LOW_ENTROPY, payload: data })
          }
          break
        }
        case undefined: {
          const data = getLowEntropyUserAgentData()

          if (isUALowEntropyJSON(data)) {
            dispatch({ type: LOW_ENTROPY, payload: data })
          }
          break
        }
        default: {
          throw new Error(errors.unexpectedErrorOccurred)
        }
      }
    }
    getUserAgentData().catch(err => {
      if (err instanceof Error) setError(err)
    })
  }, [params?.entropy, params?.hints])

  if (error instanceof Error) return error

  return state
}

async function getHighEntropyUserAgentData(
  hints: Hint[]
): Promise<UADataValues | void> {
  try {
    const agentData = await navigator.userAgentData?.getHighEntropyValues(hints)

    if (agentData === undefined) {
      throw new Error(errors.userAgentApiUndefined)
    }

    return agentData
  } catch (err: unknown) {
    if (!(err instanceof Error)) throw new Error(errors.unexpectedErrorOccurred)

    if (err.name === notAllowedErrorName) {
      throw new Error(errors.permissionDenied)
    }

    throw err
  }
}

function getLowEntropyUserAgentData(): UALowEntropyJSON | void {
  if (navigator.userAgentData === undefined)
    throw new Error(errors.userAgentApiUndefined)

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
  }
}

export { useUserAgentClientHints, errors, notAllowedErrorName }
