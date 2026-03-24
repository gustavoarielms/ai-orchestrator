# Module Diagram

```mermaid
flowchart LR
    AppModule --> AnalyzeModule
    AppModule --> RefinementModule
    AppModule --> PlanningModule
    AppModule --> SystemModule
    AppModule --> AiModule
    AppModule --> MetricsModule
    AppModule --> ResilienceModule

    AnalyzeModule --> AnalyzeController
    AnalyzeModule --> AnalyzeUseCase
    AnalyzeModule --> OpenAiAnalysisProvider
    AnalyzeModule --> ClaudeAnalysisProvider
    AnalyzeModule --> FallbackAnalysisProvider
    AnalyzeModule --> AiProviderResolver

    RefinementModule --> RefinementController
    RefinementModule --> RefineUseCase
    RefinementModule --> OpenAiRefinementProvider
    RefinementModule --> ClaudeRefinementProvider
    RefinementModule --> FallbackRefinementProvider
    RefinementModule --> AiProviderResolver

    AiModule --> AiProviderResolver
    AiModule --> OpenAiStructuredExecutor

    PlanningModule --> PlanningController
    PlanningModule --> PlanRequirementUseCase

    SystemModule --> HealthController
    SystemModule --> MetricsController
    SystemModule --> ResilienceController

    MetricsModule --> MetricsRecorder
    MetricsModule --> InMemoryMetricsService

    ResilienceModule --> CircuitBreaker
    ResilienceModule --> InMemoryCircuitBreakerService
    ResilienceModule --> ProviderFailoverExecutor
```
