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

    class CircuitBreaker {
      <<interface>>
      +canExecute(provider)
      +recordSuccess(provider)
      +recordFailure(provider)
      +getState(provider)
      +getAllStates()
    }

    class InMemoryCircuitBreakerService

    AnalyzeController --> AnalyzeUseCase
    AnalyzeUseCase --> AnalysisProvider

    FallbackAnalysisProvider ..|> AnalysisProvider
    OpenAiAnalysisProvider ..|> AnalysisProvider
    ClaudeAnalysisProvider ..|> AnalysisProvider

    FallbackAnalysisProvider --> AnalysisProvider : primary
    FallbackAnalysisProvider --> AnalysisProvider : fallback
    FallbackAnalysisProvider --> MetricsRecorder
    FallbackAnalysisProvider --> CircuitBreaker

    InMemoryMetricsService ..|> MetricsRecorder
    InMemoryCircuitBreakerService ..|> CircuitBreaker