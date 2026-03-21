# Module Diagram

```mermaid
flowchart LR
    AppModule --> AnalyzeModule
    AppModule --> SystemModule
    AppModule --> MetricsModule

    AnalyzeModule --> AnalyzeController
    AnalyzeModule --> AnalyzeUseCase
    AnalyzeModule --> OpenAiAnalysisProvider
    AnalyzeModule --> ClaudeAnalysisProvider

    SystemModule --> HealthController
    SystemModule --> MetricsController

    MetricsModule --> MetricsRecorder
    MetricsModule --> InMemoryMetricsService