# AI Runtime Diagram

```mermaid
flowchart TD
    Client[Client Request] --> Controller[Feature Controller]
    Controller --> UseCase[Feature Use Case]
    UseCase --> Port[Domain Provider Port]
    Port --> FeatureProvider[Feature OpenAI Provider]

    subgraph SharedAI["Shared AI Layer"]
        OpenAIExec[OpenAiStructuredExecutor]
    end

    subgraph Vendors["External Providers"]
        OpenAI[OpenAI API]
    end

    FeatureProvider --> OpenAIExec
    OpenAIExec --> OpenAI

    Planning[PlanningModule] --> RefineUseCase[RefineUseCase]
    Planning --> AnalyzeUseCase[AnalyzeUseCase]

    classDef shared fill:#eef6ff,stroke:#2f6fed,stroke-width:1px;
    classDef vendor fill:#fff8e8,stroke:#c88a04,stroke-width:1px;

    class OpenAIExec shared;
    class OpenAI vendor;
```

## What This Diagram Shows

- feature modules keep domain ports and use cases explicit
- `OpenAiStructuredExecutor` owns OpenAI structured execution, retry, parsing, and error mapping
- `PlanningModule` stays outside provider orchestration and only composes use cases
