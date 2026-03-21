# Analyze Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as AnalyzeController
    participant UseCase as AnalyzeUseCase
    participant Provider as FallbackAnalysisProvider
    participant Primary as Primary Provider
    participant Secondary as Fallback Provider
    participant Metrics as MetricsRecorder
    participant Logger as Logger

    Client->>Controller: POST /analyze
    Controller->>Metrics: incrementRequest()
    Controller->>UseCase: execute(input)

    UseCase->>Provider: analyze(input)
    Provider->>Primary: analyze(input)

    alt primary success
        Primary-->>Provider: AnalyzeResponse
        Provider-->>UseCase: AnalyzeResponse
        UseCase-->>Controller: AnalyzeResponse
        Controller->>Metrics: recordLatency()
        Controller-->>Client: 201 Created
    else primary failure
        Primary-->>Provider: error
        Provider->>Logger: log fallback attempt
        Provider->>Metrics: incrementFallback()
        Provider->>Secondary: analyze(input)

        alt fallback success
            Secondary-->>Provider: AnalyzeResponse
            Provider-->>UseCase: AnalyzeResponse
            UseCase-->>Controller: AnalyzeResponse
            Controller->>Metrics: recordLatency()
            Controller-->>Client: 201 Created
        else fallback failure
            Secondary-->>Provider: error
            Provider-->>UseCase: error
            UseCase->>Metrics: incrementError(code)
            Controller->>Metrics: recordLatency()
            Controller-->>Client: error response
        end
    end