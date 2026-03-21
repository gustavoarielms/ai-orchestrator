# Analyze Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller as AnalyzeController
    participant UseCase as AnalyzeUseCase
    participant ProviderPort as AnalysisProvider
    participant OpenAIProvider as OpenAiAnalysisProvider
    participant OpenAI as OpenAI API
    participant Parser as parseAnalyzeResponse
    participant Metrics as MetricsRecorder
    participant Logger as Logger

    Client->>Controller: POST /analyze
    Controller->>Metrics: incrementRequest()
    Controller->>Logger: log request received
    Controller->>UseCase: execute(input)

    UseCase->>Logger: log use case started
    UseCase->>ProviderPort: analyze(input)

    ProviderPort->>OpenAIProvider: delegated call
    OpenAIProvider->>Logger: log provider call
    OpenAIProvider->>OpenAI: responses.create(...)
    OpenAI-->>OpenAIProvider: raw response
    OpenAIProvider->>Parser: parseAnalyzeResponse(output)

    alt valid response
        Parser-->>OpenAIProvider: AnalyzeResponse
        OpenAIProvider-->>UseCase: AnalyzeResponse
        UseCase-->>Controller: AnalyzeResponse
        Controller->>Metrics: recordLatency()
        Controller->>Logger: log request completed
        Controller-->>Client: 200 OK
    else invalid response
        Parser-->>OpenAIProvider: throws BadRequestException
        OpenAIProvider->>Metrics: incrementRetry()
        OpenAIProvider->>Logger: log retry
        OpenAIProvider->>OpenAI: retry request
    else provider failure
        OpenAIProvider->>Logger: log provider error
        OpenAIProvider-->>UseCase: mapped exception
        UseCase->>Metrics: incrementError(code)
        UseCase->>Logger: log use case failed
        Controller->>Metrics: recordLatency()
        Controller-->>Client: error response
    end