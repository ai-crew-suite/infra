# 🔌 SERVICE-LEVEL API PROXIES

## The WireMock control engine

Configured to pull json bodies straight from `../mock-fixtures/`

## Handling Multiple Objects and Multiple Calls

If you keep your setup limited to a single static JSON file, **yes, WireMock will blindly return that exact same single entry over and over again** regardless of whether you are looking at the `platform` component, the `drivers` component, or the `agents` component.

To simulate a robust ecosystem where **different components return entirely different metrics and alert profiles across multiple calls**, you utilize WireMock’s native **Query Parameter Matching** and **URL Path Routing** engine rules.

Instead of creating one single catch-all rule, you create distinct **Mapping Descriptor Blueprints** inside your `packages/mock-network/mappings/` folder.

### Strategy A: Returning Different Data Based on the Component Query

You create a mapping rule that looks at the incoming URL query parameter to decide which vendor JSON file to return.

Create **`packages/mock-network/mappings/pagerduty-platform.json`**:

```json
{
  "request": {
    "method": "GET",
    "urlPath": "/api/v1/incidents",
    "queryParameters": {
      "service_ids[]": {
        "equalTo": "SRV-PLATFORM"
      }
    }
  },
  "response": {
    "status": 200,
    "bodyFileName": "vendor/pagerduty-platform-incidents.json",
    "headers": { "Content-Type": "application/json" }
  }
}
```

Then create a sister rule for your user-facing interface, **`packages/mock-network/mappings/pagerduty-agents.json`**:

```json
{
  "request": {
    "method": "GET",
    "urlPath": "/api/v1/incidents",
    "queryParameters": {
      "service_ids[]": {
        "equalTo": "SRV-AGENTS"
      }
    }
  },
  "response": {
    "status": 200,
    "bodyFileName": "vendor/pagerduty-agents-incidents.json",
    "headers": { "Content-Type": "application/json" }
  }
}
```

Now, inside your renamed **`packages/mock-fixtures/vendor/`** folder, you split your payloads into two distinct, high-fidelity mock files:

- `pagerduty-platform-incidents.json` (Returns your critical vector leak alert)
- `pagerduty-agents-incidents.json` (Returns a completely clean array, or a different UI layout warning)

### Strategy B: Simulating Changing State Across Multiple Calls (Advanced)

If you want to test what happens when an alert changes state over time (e.g., Call #1 returns a `triggered` alert, but Call #2 returns `resolved`), you activate **WireMock Scenarios (Finite State Machines)**.

You link your mapping rules together using state phases:

```json
// Fragment inside mapping call #1
"scenarioName": "Incident Lifecycle",
"requiredScenarioState": "Started",
"newScenarioState": "Incident Acknowledged",
"response": { "bodyFileName": "vendor/alert-triggered.json" }

// Fragment inside mapping call #2
"scenarioName": "Incident Lifecycle",
"requiredScenarioState": "Incident Acknowledged",
"response": { "bodyFileName": "vendor/alert-resolved.json" }
```

When your Playwright E2E testing framework hits the endpoint the first time, it sees the active error. The moment the test script triggers a mock remediation routine, WireMock automatically clicks its internal state machine forward. On the next browser refresh call, it gracefully serves the clean, resolved dataset automatically!
