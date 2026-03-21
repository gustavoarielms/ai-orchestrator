# Architecture Overview Diagram

```mermaid
flowchart TD
    Client[Client] --> App[AppModule]

    App --> AnalyzeModule[AnalyzeModule]
    App --> SystemModule[SystemModule]
    App --> MetricsModule[MetricsModule]
    App --> ResilienceModule[ResilienceModule]

    AnalyzeModule --> AnalyzeController[AnalyzeController]
    AnalyzeController --> AnalyzeUseCase[AnalyzeUseCase]
    AnalyzeUseCase --> AnalysisProvider[AnalysisProvider Port]

    AnalysisProvider --> FallbackProvider[FallbackAnalysisProvider]

    FallbackProvider --> CircuitBreaker[CircuitBreaker Port]
    CircuitBreaker --> InMemoryCircuitBreaker[InMemoryCircuitBreakerService]

    FallbackProvider --> PrimaryProvider[Primary Provider]
    FallbackProvider --> SecondaryProvider[Fallback Provider]

    PrimaryProvider --> OpenAIProvider[OpenAiAnalysisProvider]
    PrimaryProvider --> ClaudeProvider[ClaudeAnalysisProvider]

    SecondaryProvider --> OpenAIProvider
    SecondaryProvider --> ClaudeProvider

    OpenAIProvider --> OpenAI[OpenAI API]

    SystemModule --> HealthController[HealthController]
    SystemModule --> MetricsController[MetricsController]
    SystemModule --> ResilienceController[ResilienceController]

    MetricsController --> MetricsRecorder[MetricsRecorder Port]
    MetricsRecorder --> InMemoryMetrics[InMemoryMetricsService]

    ResilienceController --> CircuitBreaker
    FallbackProvider --> MetricsRecorder