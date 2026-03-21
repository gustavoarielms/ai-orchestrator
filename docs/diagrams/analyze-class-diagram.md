# Analyze Module Class Diagram

```mermaid
classDiagram
    class AnalyzeController
    class AnalyzeUseCase

    class AnalysisProvider {
      <<interface>>
      +analyze(input)
    }

    class FallbackAnalysisProvider
    class OpenAiAnalysisProvider
    class ClaudeAnalysisProvider

    class MetricsRecorder {
      <<interface>>
      +incrementRequest()
      +incrementError(code)
      +incrementRetry()
      +incrementFallback()
      +recordLatency(durationMs)
      +getMetrics()
    }

    class InMemoryMetricsService

    AnalyzeController --> AnalyzeUseCase
    AnalyzeUseCase --> AnalysisProvider

    FallbackAnalysisProvider ..|> AnalysisProvider
    OpenAiAnalysisProvider ..|> AnalysisProvider
    ClaudeAnalysisProvider ..|> AnalysisProvider

    FallbackAnalysisProvider --> AnalysisProvider : primary
    FallbackAnalysisProvider --> AnalysisProvider : fallback
    FallbackAnalysisProvider --> MetricsRecorder

    InMemoryMetricsService ..|> MetricsRecorder