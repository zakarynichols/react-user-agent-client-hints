import { useUserAgentClientHints } from "../useUserAgentClientHints"
import { renderHook, waitFor } from "@testing-library/react"

const lowEntropyUserAgentData: UALowEntropyJSON = {
  brands: [{ brand: "Google Chrome", version: "91" }],
  mobile: false,
  platform: "Windows"
}

const highEntropyUserAgentData: UADataValues = {
  ...lowEntropyUserAgentData,
  architecture: "x86",
  bitness: "64",
  model: "Pixel 2XL",
  platformVersion: "10.0"
}

Object.defineProperty(navigator, "userAgentData", {
  value: {
    toJSON: () => lowEntropyUserAgentData,
    getHighEntropyValues: async (hints: string[]) => highEntropyUserAgentData
  },
  writable: true
})

it("returns low entropy user-agent data when passed empty parameters.", () => {
  const { result } = renderHook(() => useUserAgentClientHints())
  expect(result.current).toEqual(lowEntropyUserAgentData)
})

it("returns low entropy user-agent data when passed 'low' entropy parameter.", () => {
  const { result } = renderHook(() =>
    useUserAgentClientHints({ entropy: "low" })
  )
  expect(result.current).toEqual(lowEntropyUserAgentData)
})

it("returns an error is low entropy user-agent data is note defined.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: undefined,
    writable: true
  })
  const { result } = renderHook(() => useUserAgentClientHints())
  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Client does not have user-agent data.")
    )
  })
})

it("returns an error is low entropy user-agent data is note defined with 'low' entropy parameter.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: undefined,
    writable: true
  })
  const { result } = renderHook(() =>
    useUserAgentClientHints({ entropy: "low" })
  )
  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Client does not have user-agent data.")
    )
  })
})

it("returns high entropy user-agent data when passed 'high' entropy parameter.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: {
      toJSON: () => lowEntropyUserAgentData,
      getHighEntropyValues: async (hints: string[]) => highEntropyUserAgentData
    },
    writable: true
  })
  const { result } = renderHook(() =>
    useUserAgentClientHints({ entropy: "high", hints: [] })
  )
  await waitFor(() => {
    expect(result.current).toEqual(highEntropyUserAgentData)
  })
})

it("returns an error if the getting high-entropy user-agent data rejects.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: {
      toJSON: () => lowEntropyUserAgentData,
      getHighEntropyValues: (hints: string[]) => {
        return Promise.reject(
          new Error("Could not retrieve high-entropy user-agent data.")
        )
      }
    },
    writable: true
  })

  const { result } = renderHook(() =>
    useUserAgentClientHints({ entropy: "high", hints: [] })
  )

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Could not retrieve high-entropy user-agent data.")
    )
  })
})

it("returns an error if the user-agent data interface is not defined.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: undefined,
    writable: true
  })

  const { result } = renderHook(() =>
    useUserAgentClientHints({ entropy: "high", hints: [] })
  )

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Could not return user-agent data.")
    )
  })
})

it("returns an error if entropy is defined, but not hints.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: undefined,
    writable: true
  })

  const { result } = renderHook(
    () =>
      //@ts-ignore
      useUserAgentClientHints({ entropy: "high", hints: undefined }) // TypeScript will not compile with hints undefined due to the overloads, but test anyway.
  )

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Cannot have high entropy and no hints.")
    )
  })
})

it("returns an error if an unexpected action was passed.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: undefined,
    writable: true
  })

  const { result } = renderHook(
    () =>
      //@ts-ignore
      useUserAgentClientHints({ entropy: "cannot happen", hints: [] }) // TypeScript will not compile with hints undefined due to the overloads, but test anyway.
  )

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("An unexpected case has been encountered.")
    )
  })
})

it("returns a fallback error if an something other than an erro was thrown.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: {
      toJSON: () => lowEntropyUserAgentData,
      getHighEntropyValues: (hints: string[]) => {
        throw { weird: "weird" }
      }
    },
    writable: true
  })

  const { result } = renderHook(() => {
    //@ts-ignore
    return useUserAgentClientHints({
      entropy: "high",
      hints: []
    }) // TypeScript will not compile with hints undefined due to the overloads, but test anyway.
  })

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("An unexpected error has occurred.")
    )
  })
})

it("returns a permission denied error if permissions are not allowed.", async () => {
  Object.defineProperty(navigator, "userAgentData", {
    value: {
      toJSON: () => lowEntropyUserAgentData,
      getHighEntropyValues: (hints: string[]) => {
        const err = new Error("Permission error")
        err.name = "NotAllowedError"
        throw err
      }
    },
    writable: true
  })

  const { result } = renderHook(() => {
    //@ts-ignore
    return useUserAgentClientHints({
      entropy: "high",
      hints: []
    }) // TypeScript will not compile with hints undefined due to the overloads, but test anyway.
  })

  await waitFor(() => {
    expect(result.current).toEqual(
      new Error("Permission denied accessing user-agent data.")
    )
  })
})
