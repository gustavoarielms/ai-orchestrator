# Planning Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as PlanningController
    participant UseCase as PlanRequirementUseCase
    participant Refine as RefineUseCase
    participant Analyze as AnalyzeUseCase
    participant Metrics as MetricsRecorder

    Client->>Controller: POST /plan
    Controller->>Metrics: incrementRequest()
    Controller->>UseCase: execute(input)

    UseCase->>Refine: execute(input)

    alt refinement success
        Refine-->>UseCase: RefineResponse
        UseCase->>Analyze: execute(enriched input)

        alt analysis success
            Analyze-->>UseCase: AnalyzeResponse
            UseCase-->>Controller: PlanResponse
            Controller->>Metrics: recordLatency()
            Controller-->>Client: 201 Created
        else analysis failure
            Analyze-->>UseCase: error
            Controller->>Metrics: recordLatency()
            Controller-->>Client: error response
        end
    else refinement failure
        Refine-->>UseCase: error
        Controller->>Metrics: recordLatency()
        Controller-->>Client: error response
    end