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

    AnalysisProvider --> OpenAIProvider[OpenAiAnalysisProvider]
    AnalysisProvider --> ClaudeProvider[ClaudeAnalysisProvider]

    OpenAIProvider --> OpenAI[OpenAI API]

    SystemModule --> HealthController[HealthController]
    SystemModule --> MetricsController[MetricsController]

    MetricsController --> MetricsRecorder[MetricsRecorder Port]
    MetricsRecorder --> InMemoryMetrics[InMemoryMetricsService]

    AnalyzeController --> MetricsRecorder
    AnalyzeUseCase --> MetricsRecorder
    OpenAIProvider --> MetricsRecorder