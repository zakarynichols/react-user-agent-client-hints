# React User Agent Client Hints

Hook for getting information about the browser and operating system of a user.

### Potential Use Cases

- Providing custom-tailored polyfills to users on identifying that their browser lacked some web platform feature.
- Working around browser bugs.
- Recording browser analytics.
- Adapting content based on user-agent information. This includes serving different content to mobile devices, in particular devices identified as low-powered. It might also include adapting the design to tailor the interfaces to the user's OS, or providing links to OS-specific ones.
- Providing a notification when a user logs in from a different browser or device, as a security feature.
- Providing the correct binary executable, on a site offering a download.
- Collecting information about the browser and device to identify application errors.
- Blocking spammers, bots, and crawlers.

### Installation

```sh
$ npm install react-user-agent-client-hints
```

### Examples

```ts
import { useUserAgentClientHints, Hint } from "react-user-agent-client-hints"

/*
 * An array containing the hints to be returned. Declare in a useMemo or in module scope for referential stability.
 */
const hints: Hint[] = useMemo(
  () => [
    "architecture",
    "model",
    "bitness",
    "platformVersion",
    "fullVersionList"
  ],
  []
)

/*
 * High entropy potentially reveals more info about the operating
 * system and browser. Under the hood is async allowing time for the
 * browser to request user permission, or make other checks.
 */
const highEntropy = useUserAgentClientHints({ entropy: "high", hints })

/*
 * Low entropy runs sync, but potentially does not reveal enough information
 * able to identify a user.
 */
const lowEntropy = useUserAgentClientHints({ entropy: "low" })
```

### References

- https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API
- https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
