import { useUserAgentData } from "react-user-agent-client-hints"

export function App() {
  const [userAgentData, error] = useUserAgentData([
    "brand",
    "model",
    "version",
    "architecture",
    "platform",
    "mobile",
    "platformVersion",
    "uaFullVersion",
    "bitness",
    "wow64",
    "fullVersionList"
  ])

  if (error) {
    return <div>{error.message}</div>
  }

  if (!userAgentData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* <p>Brands: {userAgentData.brands.map(brand => brand.brand).join(", ")}</p> */}
      <p>Mobile: {userAgentData.mobile ? "Yes" : "No"}</p>
      <p>Architecture: {userAgentData.architecture}</p>
      <p>Bitness: {userAgentData.bitness}</p>
      <p>Model: {userAgentData.model}</p>
      <p>Platform: {userAgentData.platform}</p>
      <p>Platform Version: {userAgentData.platformVersion}</p>
      <p>UA Full Version: {userAgentData.uaFullVersion}</p>
      <p>Wow64: {userAgentData.wow64 ? "Yes" : "No"}</p>
      <p>
        Full Version List:{" "}
        {/* {userAgentData.fullVersionList.map(brand => brand.brand).join(", ")} */}
      </p>
    </div>
  )
}
