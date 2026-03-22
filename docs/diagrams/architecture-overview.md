# Architecture Overview Diagram

```mermaid
flowchart TD
    Client[Client] --> App[AppModule]

    App --> AnalyzeModule[AnalyzeModule]
    App --> RefinementModule[RefinementModule]
    App --> PlanningModule[PlanningModule]
    App --> SystemModule[SystemModule]
    App --> MetricsModule[MetricsModule]
    App --> ResilienceModule[ResilienceModule]

    AnalyzeModule --> AnalyzeController[AnalyzeController]
    AnalyzeController --> AnalyzeUseCase[AnalyzeUseCase]
    AnalyzeUseCase --> AnalysisProvider[AnalysisProvider Port]
    AnalyzeController --> MetricsRecorder[MetricsRecorder Port]
    AnalyzeUseCase --> MetricsRecorder

    RefinementModule --> RefinementController[RefinementController]
    RefinementController --> RefineUseCase[RefineUseCase]
    RefineUseCase --> RefinementProvider[RefinementProvider Port]
    RefinementProvider --> OpenAiRefinementProvider[OpenAiRefinementProvider]
    OpenAiRefinementProvider --> RefinementExecutor[OpenAiStructuredExecutor]
    RefinementExecutor --> OpenAI[OpenAI API]

    PlanningModule --> PlanningController[PlanningController]
    PlanningController --> PlanUseCase[PlanRequirementUseCase]
    PlanUseCase --> RefineUseCase
    PlanUseCase --> AnalyzeUseCase

    AnalysisProvider --> FallbackProvider[FallbackAnalysisProvider]

    FallbackProvider --> CircuitBreaker[CircuitBreaker Port]
    CircuitBreaker --> InMemoryCircuitBreaker[InMemoryCircuitBreakerService]

    FallbackProvider --> PrimaryProvider[Primary Provider]
    FallbackProvider --> SecondaryProvider[Fallback Provider]

    PrimaryProvider --> OpenAIProvider[OpenAiAnalysisProvider]
    PrimaryProvider --> ClaudeProvider[ClaudeAnalysisProvider]

    SecondaryProvider --> OpenAIProvider
    SecondaryProvider --> ClaudeProvider

    OpenAIProvider --> AnalyzeExecutor[OpenAiStructuredExecutor]
    AnalyzeExecutor --> OpenAI

    SystemModule --> HealthController[HealthController]
    SystemModule --> MetricsController[MetricsController]
    SystemModule --> ResilienceController[ResilienceController]

    MetricsRecorder --> InMemoryMetrics[InMemoryMetricsService]
    ResilienceController --> CircuitBreaker
    FallbackProvider --> MetricsRecorder
```
