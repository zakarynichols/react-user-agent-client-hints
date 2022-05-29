import { Hint, useUserAgentClientHints } from "../useUserAgentClientHints"
import { act, render } from "@testing-library/react"
import React from "react"
import { isUADataValues, isUALowEntropyJSON } from "../../types"

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
jest.mock("../useUserAgentClientHints", () => ({
  useUserAgentClientHints: mockUseUserAgentClientHints
}))
const mockUseUserAgentClientHints = jest.fn(
  (params?: { entropy?: "high" | "low"; hints?: Hint[] }) =>
    useUserAgentClientHints(params as any)
)

const MockComponent = (props?: {
  entropy?: "high" | "low"
  hints?: Hint[]
}) => {
  let userAgentData: any
  act(() => {
    const data = mockUseUserAgentClientHints(props)
    userAgentData = data
  })
  if (isError(userAgentData)) return <div>Error</div>

  if (isUADataValues(userAgentData)) return <div>UADataValues</div>

  if (isUALowEntropyJSON(userAgentData)) return <div>UALowEntropyJSON</div>

  return <div>Loading...</div>
}

it("returns error ui if hook returned an error.", () => {
  mockUseUserAgentClientHints.mockImplementationOnce(
    params => new Error("I broke.")
  )
  const { getByText } = render(<MockComponent />)
  expect(() => getByText("Error")).not.toThrow()
})

it("returns low entropy data when hook called with empty parameters.", () => {
  mockUseUserAgentClientHints.mockImplementationOnce(
    () => lowEntropyUserAgentData
  )
  const { getByText } = render(<MockComponent />)
  expect(() => getByText("UALowEntropyJSON")).not.toThrow()
})

it("returns low entropy data when called with specified 'low' entropy parameter.", () => {
  mockUseUserAgentClientHints.mockImplementationOnce(
    params => lowEntropyUserAgentData
  )
  const { getByText } = render(<MockComponent entropy="low" />)
  expect(() => getByText("UALowEntropyJSON")).not.toThrow()
})

it("returns high entropy data when called with specified 'high' entropy parameter.", async () => {
  mockUseUserAgentClientHints.mockImplementationOnce(
    params => highEntropyUserAgentData
  )
  const { getByText } = render(
    <MockComponent
      entropy="high"
      hints={[
        "architecture",
        "model",
        "bitness",
        "platformVersion",
        "fullVersionList"
      ]}
    />
  )
  expect(() => getByText("UADataValues")).not.toThrow()
})

function isError(err: Error): err is Error {
  return err instanceof Error
}
