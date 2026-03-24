# AI Runtime Diagram

```mermaid
flowchart TD
    Client[Client Request] --> Controller[Feature Controller]
    Controller --> UseCase[Feature Use Case]
    UseCase --> Port[Domain Provider Port]

    Port --> FallbackProvider[Feature Fallback Provider]

    subgraph SharedAI["Shared AI Layer"]
        Resolver[AiProviderResolver]
        Failover[ProviderFailoverExecutor]
        OpenAIExec[OpenAiStructuredExecutor]
        ClaudeExec[ClaudeStructuredExecutor future]
    end

    subgraph Resilience["Shared Resilience"]
        Metrics[MetricsRecorder]
        Circuit[CircuitBreaker]
    end

    subgraph Vendors["External Providers"]
        OpenAI[OpenAI API]
        Claude[Claude API future]
    end

    FallbackProvider --> Resolver
    FallbackProvider --> Failover

    Failover --> Metrics
    Failover --> Circuit
    Failover --> Primary[Primary Feature Provider]
    Failover --> Secondary[Fallback Feature Provider]

    Primary --> OpenAIProvider[OpenAI-backed Provider]
    Primary --> ClaudeProvider[Claude-backed Provider]
    Secondary --> OpenAIProvider
    Secondary --> ClaudeProvider

    OpenAIProvider --> OpenAIExec
    ClaudeProvider --> ClaudeExec

    OpenAIExec --> Metrics
    OpenAIExec --> OpenAI
    ClaudeExec --> Claude

    Planning[PlanningModule] --> RefineUseCase[RefineUseCase]
    Planning --> AnalyzeUseCase[AnalyzeUseCase]

    classDef shared fill:#eef6ff,stroke:#2f6fed,stroke-width:1px;
    classDef resilience fill:#eefbf2,stroke:#2f8f4e,stroke-width:1px;
    classDef vendor fill:#fff8e8,stroke:#c88a04,stroke-width:1px;

    class Resolver,Failover,OpenAIExec,ClaudeExec shared;
    class Metrics,Circuit resilience;
    class OpenAI,Claude vendor;
```

## What This Diagram Shows

- feature modules keep domain ports and use cases explicit
- `AiProviderResolver` decides which provider is primary and which one is fallback
- `ProviderFailoverExecutor` owns failover, circuit breaker checks, and fallback metrics
- `OpenAiStructuredExecutor` owns OpenAI structured execution, retry, parsing, and error mapping
- `PlanningModule` stays outside provider orchestration and only composes use cases
