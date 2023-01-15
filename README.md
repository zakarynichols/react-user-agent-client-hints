# React User Agent Client Hints

React hook implementing the User-Agent Client Hints API to get information about the browser and operating system of a user.

![example workflow](https://github.com/zakarynichols/react-user-agent-client-hints/actions/workflows/e2e.yml/badge.svg?branch=develop)

The useUserAgentData hook allows you to fetch high entropy user-agent data from the browser. It returns an object with the user-agent data, or an error if something went wrong.

## Usage

To use the useUserAgentData hook, you must pass an array of hints as an argument. These hints are used to request specific user-agent data.

```tsx
import { useUserAgentData } from "path/to/hook"

function MyComponent() {
  const [userAgentData, error] = useUserAgentData(["brand", "version"])

  if (error) {
    return <div>{error.message}</div>
  }

  if (!userAgentData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <p>Brands: {userAgentData.brands.map(brand => brand.brand).join(", ")}</p>
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
        {userAgentData.fullVersionList.map(brand => brand.brand).join(", ")}
      </p>
    </div>
  )
}
```

```ts
interface UADataValues {
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
```

## Error handling

If there is an error while fetching the user-agent data, useUserAgentData will return an error object with a message. The possible error messages are:

- User-agent client hints API is undefined.: The navigator.userAgentData object is not defined in the browser.
- Permission denied accessing user-agent data: The user has not granted permission for the client hints.
- Failed to get user-agent data: An unexpected error occurred.

### Potential Use Cases

- Providing custom-tailored polyfills to users on identifying that their browser lacked some web platform feature.
- Working around browser bugs.
- Recording browser analytics.
- Adapting content based on user-agent information. This includes serving different content to mobile devices, in particular devices identified as low-powered. It might also include adapting the design to tailor the interfaces to the user's OS, or providing links to OS-specific ones.
- Providing a notification when a user logs in from a different browser or device, as a security feature.
- Providing the correct binary executable, on a site offering a download.
- Collecting information about the browser and device to identify application errors.
- Blocking spammers, bots, and crawlers.

## Possible Hints

- "brand": The brand of the user agent, such as "Google", "Apple", "Mozilla", etc.
- "model": The model of the device, such as "iPhone", "Pixel", "Galaxy", etc.
- "version": The version of the user agent, such as "13.0", "11.0", "78.0", etc.
- "architecture": The architecture of the device, such as "arm", "x86", "x86_64", etc.
- "platform": The platform the user agent is running on, such as "Windows", "macOS", "iOS", "Android", etc.
- "mobile": A boolean indicating whether the device is a mobile device or not.
- "fullVersionList": A list of objects representing the full version of the user agent and the brand
- "wow64": A boolean indicating whether the user agent is running on a 32-bit version of Windows on a 64-bit system.

### References

- https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API
- https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
