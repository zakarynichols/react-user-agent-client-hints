import React from "react"
import { render, waitFor } from "@testing-library/react"
import { useUserAgentData } from "../useUserAgentData"

// TODO: Add more tests or use a e2e framework to actually test browsers `navigator.userAgentData`.

describe("useUserAgentData", () => {
  afterEach(() => {
    // clear the mock
    jest.clearAllMocks()
  })

  it("should render the user agent data when hints are provided", async () => {
    // mock the `navigator.userAgentData` object
    Object.defineProperty(navigator, "userAgentData", {
      value: {
        getHighEntropyValues: jest.fn().mockResolvedValue({
          brands: [{ brand: "brand", version: "version" }],
          mobile: true,
          architecture: "architecture",
          bitness: "bitness",
          model: "model",
          platform: "platform",
          platformVersion: "platformVersion",
          uaFullVersion: "uaFullVersion",
          wow64: true,
          fullVersionList: [{ brand: "brand", version: "version" }]
        })
      },
      configurable: true
    })
    const TestComponent = () => {
      const [userAgentData, error] = useUserAgentData(["brand", "version"])
      if (error) {
        return <div data-testid="error">{error.message}</div>
      }
      if (userAgentData === null) {
        return <div data-testid="loading">Loading...</div>
      }
      return (
        <div data-testid="user-agent-data">
          <p>Brands: {userAgentData.brands.map(b => b.brand).join(", ")}</p>
          <p>Mobile: {userAgentData.mobile.toString()}</p>
          <p>Architecture: {userAgentData.architecture}</p>
          <p>Bitness: {userAgentData.bitness}</p>
          <p>Model: {userAgentData.model}</p>
          <p>Platform: {userAgentData.platform}</p>
          <p>Platform Version: {userAgentData.platformVersion}</p>
          <p>UA Full Version: {userAgentData.uaFullVersion}</p>
          <p>Wow64: {userAgentData.wow64.toString()}</p>
          <p>
            Full Version List:{" "}
            {userAgentData.fullVersionList.map(b => b.version).join(", ")}
          </p>
        </div>
      )
    }

    const { getByText, getByTestId } = render(<TestComponent />)

    // wait for the data to be loaded
    await waitFor(() => expect(getByTestId("user-agent-data")).toBeDefined())

    expect(getByText("Brands: brand")).toBeDefined()
    expect(getByText("Mobile: true")).toBeDefined()
    expect(getByText("Architecture: architecture")).toBeDefined()
    expect(getByText("Bitness: bitness")).toBeDefined()
    expect(getByText("Model: model")).toBeDefined()
    expect(getByText("Platform: platform")).toBeDefined()
    expect(getByText("Platform Version: platformVersion")).toBeDefined()
    expect(getByText("UA Full Version: uaFullVersion")).toBeDefined()
    expect(getByText("Wow64: true")).toBeDefined()
    expect(getByText("Full Version List: version")).toBeDefined()
  })
})
