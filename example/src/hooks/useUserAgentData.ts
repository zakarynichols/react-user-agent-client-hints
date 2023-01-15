import { useEffect, useReducer, useState } from "react"
import { UADataValues, UALowEntropyJSON, NavigatorUA } from "./userAgentData"

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

interface State {
  userAgentData: UADataValues | null
  error: Error | null
}

interface SetUserAgentDataAction {
  type: "SET_USER_AGENT_DATA"
  payload: UADataValues
}

interface SetErrorAction {
  type: "SET_ERROR"
  payload: Error
}

type Action = SetUserAgentDataAction | SetErrorAction

const initialState: State = {
  userAgentData: null,
  error: null
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER_AGENT_DATA":
      return { ...state, userAgentData: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function useUserAgentData(
  hints: Hint[]
): [UADataValues | null, Error | null] {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function getHighEntropyUAData(): Promise<void> {
      try {
        if (!isNavigatorUA(navigator)) {
          dispatch({
            type: "SET_ERROR",
            payload: new Error(
              "High entropy user agent data not available in this browser"
            )
          })
          return
        }
        // check if the `navigator.userAgentData` object is available
        if (navigator.userAgentData === undefined) {
          dispatch({
            type: "SET_ERROR",
            payload: new Error("User-agent client hints API is undefined.")
          })
          return
        }
        // check if the user has granted permission for the client hints
        if (navigator.userAgentData.getHighEntropyValues === undefined) {
          dispatch({
            type: "SET_ERROR",
            payload: new Error("Permission denied accessing user-agent data")
          })
          return
        }
        // request the high entropy values
        const agentData = await navigator.userAgentData.getHighEntropyValues(
          hints
        )
        dispatch({ type: "SET_USER_AGENT_DATA", payload: agentData })
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: new Error("Failed to get user-agent data")
        })
      }
    }
    getHighEntropyUAData()
  }, [hints])

  return [state.userAgentData, state.error]
}

export function getLowEntropyUserAgentData(): UALowEntropyJSON | void {
  if (!isNavigatorUA(navigator)) return
  if (navigator.userAgentData === undefined) return
  return navigator.userAgentData.toJSON()
}

export function isNavigatorUA(navigator: unknown): navigator is NavigatorUA {
  return navigator instanceof Navigator && "userAgentData" in navigator
}
