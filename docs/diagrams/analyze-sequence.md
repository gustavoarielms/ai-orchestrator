# Analyze Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as AnalyzeController
    participant UseCase as AnalyzeUseCase
    participant Provider as FallbackAnalysisProvider
    participant Circuit as CircuitBreaker
    participant Primary as Primary Provider
    participant Secondary as Fallback Provider
    participant Metrics as MetricsRecorder
    participant Logger as Logger

    Client->>Controller: POST /analyze
    Controller->>Metrics: incrementRequest()
    Controller->>UseCase: execute(input)

    UseCase->>Provider: analyze(input)

    Provider->>Circuit: canExecute(primary)
    alt primary circuit closed
        Provider->>Primary: analyze(input)

        alt primary success
            Primary-->>Provider: AnalyzeResponse
            Provider->>Circuit: recordSuccess(primary)
            Provider-->>UseCase: AnalyzeResponse
            UseCase-->>Controller: AnalyzeResponse
            Controller->>Metrics: recordLatency()
            Controller-->>Client: 201 Created
        else primary failure
            Primary-->>Provider: error
            Provider->>Circuit: recordFailure(primary)

            alt fallback enabled
                Provider->>Logger: log fallback attempt
                Provider->>Metrics: incrementFallback()
                Provider->>Circuit: canExecute(fallback)

                alt fallback circuit closed
                    Provider->>Secondary: analyze(input)

                    alt fallback success
                        Secondary-->>Provider: AnalyzeResponse
                        Provider->>Circuit: recordSuccess(fallback)
                        Provider-->>UseCase: AnalyzeResponse
                        UseCase-->>Controller: AnalyzeResponse
                        Controller->>Metrics: recordLatency()
                        Controller-->>Client: 201 Created
                    else fallback failure
                        Secondary-->>Provider: error
                        Provider->>Circuit: recordFailure(fallback)
                        Provider-->>UseCase: error
                        UseCase->>Metrics: incrementError(code)
                        Controller->>Metrics: recordLatency()
                        Controller-->>Client: error response
                    end
                else fallback circuit open
                    Provider-->>UseCase: ServiceUnavailableException
                    UseCase->>Metrics: incrementError(code)
                    Controller->>Metrics: recordLatency()
                    Controller-->>Client: 503 Service Unavailable
                end
            else no fallback
                Provider-->>UseCase: error
                UseCase->>Metrics: incrementError(code)
                Controller->>Metrics: recordLatency()
                Controller-->>Client: error response
            end
        end
    else primary circuit open
        Provider-->>UseCase: ServiceUnavailableException
        UseCase->>Metrics: incrementError(code)
        Controller->>Metrics: recordLatency()
        Controller-->>Client: 503 Service Unavailable
    end