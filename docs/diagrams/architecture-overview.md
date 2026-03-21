# Architecture Overview Diagram

```mermaid
flowchart TD
    Client[Client] --> App[AppModule]

    App --> AnalyzeModule[AnalyzeModule]
    App --> SystemModule[SystemModule]
    App --> MetricsModule[MetricsModule]

    AnalyzeModule --> AnalyzeController[AnalyzeController]
    AnalyzeController --> AnalyzeUseCase[AnalyzeUseCase]
    AnalyzeUseCase --> AnalysisProvider[AnalysisProvider Port]

    AnalysisProvider --> FallbackProvider[FallbackAnalysisProvider]

    FallbackProvider --> PrimaryProvider[Primary Provider]
    FallbackProvider --> SecondaryProvider[Fallback Provider]

    PrimaryProvider --> OpenAIProvider[OpenAiAnalysisProvider]
    PrimaryProvider --> ClaudeProvider[ClaudeAnalysisProvider]

    SecondaryProvider --> OpenAIProvider
    SecondaryProvider --> ClaudeProvider

    OpenAIProvider --> OpenAI[OpenAI API]

    SystemModule --> HealthController[HealthController]
    SystemModule --> MetricsController[MetricsController]

    MetricsController --> MetricsRecorder[MetricsRecorder Port]
    MetricsRecorder --> InMemoryMetrics[InMemoryMetricsService]

    FallbackProvider --> MetricsRecorder