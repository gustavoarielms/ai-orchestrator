# Module Diagram

```mermaid
flowchart LR
    AppModule --> AnalyzeModule
    AppModule --> RefinementModule
    AppModule --> PlanningModule
    AppModule --> SystemModule
    AppModule --> MetricsModule

    AnalyzeModule --> AnalyzeController
    AnalyzeModule --> AnalyzeUseCase
    AnalyzeModule --> OpenAiAnalysisProvider
    AnalyzeModule --> ClaudeAnalysisProvider

    RefinementModule --> RefinementController
    RefinementModule --> RefineUseCase
    RefinementModule --> OpenAiRefinementProvider

    PlanningModule --> PlanningController
    PlanningModule --> PlanRequirementUseCase

    SystemModule --> HealthController
    SystemModule --> MetricsController

    MetricsModule --> MetricsRecorder
    MetricsModule --> InMemoryMetricsService
```