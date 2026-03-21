# Analyze Module Class Diagram

```mermaid
classDiagram
    class AnalyzeController {
      +analyze(body)
    }

    class AnalyzeUseCase {
      -analysisProvider: AnalysisProvider
      -metricsRecorder: MetricsRecorder
      +execute(input)
    }

    class AnalysisProvider {
      <<interface>>
      +analyze(input)
    }

    class OpenAiAnalysisProvider {
      -metricsRecorder: MetricsRecorder
      +analyze(input)
    }

    class ClaudeAnalysisProvider {
      +analyze(input)
    }

    class MetricsRecorder {
      <<interface>>
      +incrementRequest()
      +incrementError(code)
      +incrementRetry()
      +recordLatency(durationMs)
      +getMetrics()
    }

    class InMemoryMetricsService {
      +incrementRequest()
      +incrementError(code)
      +incrementRetry()
      +recordLatency(durationMs)
      +getMetrics()
    }

    class AnalyzeRequest
    class AnalyzeResponse

    AnalyzeController --> AnalyzeUseCase
    AnalyzeUseCase --> AnalysisProvider
    OpenAiAnalysisProvider ..|> AnalysisProvider
    ClaudeAnalysisProvider ..|> AnalysisProvider

    AnalyzeUseCase --> MetricsRecorder
    OpenAiAnalysisProvider --> MetricsRecorder
    InMemoryMetricsService ..|> MetricsRecorder

    AnalyzeUseCase --> AnalyzeRequest
    AnalyzeUseCase --> AnalyzeResponse