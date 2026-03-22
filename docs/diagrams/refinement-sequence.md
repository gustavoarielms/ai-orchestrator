# Refine Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as RefinementController
    participant UseCase as RefineUseCase
    participant Provider as OpenAiRefinementProvider
    participant Metrics as MetricsRecorder
    participant Logger as Logger

    Client->>Controller: POST /refine
    Controller->>Metrics: incrementRequest()
    Controller->>UseCase: execute(input)

    UseCase->>Provider: refine(input)

    alt success
        Provider-->>UseCase: RefineResponse
        UseCase-->>Controller: RefineResponse
        Controller->>Metrics: recordLatency()
        Controller-->>Client: 201 Created
    else failure
        Provider-->>UseCase: error
        UseCase->>Metrics: incrementError(code)
        Controller->>Metrics: recordLatency()
        Controller-->>Client: error response
    end