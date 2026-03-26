# Architecture Overview

## Introduction

The AI Orchestrator is designed as a backend service responsible for coordinating AI-driven workflows across product and engineering domains.

Its primary responsibility is to:
- receive structured or unstructured inputs
- orchestrate analysis using AI providers
- return structured outputs for downstream usage

---

## Architectural Style

The system follows a **modular architecture with hexagonal tendencies (hexagonal-light)**.

This means:
- clear separation between layers
- controlled interaction with external systems
- minimal abstraction to avoid over-engineering

Related ADRs:

- `docs/adr/ADR-001-orchestrator-base-architecture.md`
- `docs/adr/ADR-002-architectural-style.md`

---

## High-Level Flow

    HTTP Request
       ↓
    Controller (Entrypoint)
       ↓
    Use Case (Application)
       ↓
    Orchestration Layer (optional)
       ↓
    Provider (Infrastructure)
       ↓
    External API (OpenAI)

---

## Diagrams

Detailed diagrams are available in:

- `docs/diagrams/architecture-overview.md`
- `docs/diagrams/ai-runtime-diagram.md`
- `docs/diagrams/analyze-sequence.md`
- `docs/diagrams/analyze-class-diagram.md`
- `docs/diagrams/module-diagram.md`

---

## Module Structure

Each module follows this structure:

    modules/
      analyze/
        entrypoints/
        application/
        domain/
        infrastructure/
      refinement/
        entrypoints/
        application/
        domain/
        infrastructure/
      development/
        entrypoints/
        application/
        domain/
        infrastructure/
      technical-design/
        entrypoints/
        application/
        domain/
        infrastructure/
      task-breakdown/
        entrypoints/
        application/
        domain/
        infrastructure/
      planning/
        entrypoints/
        application/
        domain/

Related ADR:

- `docs/adr/ADR-004-feature-modules-in-nestjs.md`

---

### AnalyzeModule

The `analyze` domain is encapsulated as a dedicated feature module.

It groups all components required for the analyze flow:

- `AnalyzeController` (entrypoint)
- `AnalyzeUseCase` (application logic)
- `AnalysisProvider` (port)
- `OpenAiAnalysisProvider` (infrastructure implementation)

This module is imported into the root `AppModule`, keeping the application composition clean and scalable.

### RefinementModule

The `refinement` domain is encapsulated as a dedicated feature module.

It groups all components required for the refinement flow:

- `RefinementController` (entrypoint)
- `RefineUseCase` (application logic)
- `RefinementProvider` (port)
- `OpenAiRefinementProvider` (infrastructure implementation)

This module is responsible for transforming raw input into structured functional requirements and is imported into the root `AppModule`.

### PlanningModule

The `planning` domain is responsible for orchestrating multiple agents to produce a consolidated result.

It groups all components required for orchestration flows:

- `PlanningController` (entrypoint)
- `PlanRequirementUseCase` (application logic)

This module composes existing use cases (e.g. refinement and analysis) without coupling endpoints, enabling agent orchestration.

Example flow:

- input is received via `/plan`
- `RefineUseCase` is executed
- refinement output is transformed into enriched input
- `AnalyzeUseCase` is executed
- `TechnicalDesignUseCase` is executed using the analysis result as its source
- `TaskBreakdownUseCase` is executed using the analysis and technical design results as its source
- a consolidated response is returned

### TechnicalDesignModule

The `technical-design` domain is encapsulated as a dedicated feature module.

It groups all components required for the technical design flow:

- `TechnicalDesignController` (entrypoint)
- `TechnicalDesignUseCase` (application logic)
- `TechnicalDesignProvider` (port)
- `OpenAiTechnicalDesignProvider` (infrastructure implementation)

This module is responsible for producing architecture-oriented technical design proposals from structured analysis input and is imported into the root `AppModule`.

### DevelopmentModule

The `development` domain is encapsulated as a dedicated feature module.

It groups all components required for the development flow:

- `DevelopmentController` (entrypoint)
- `DevelopmentUseCase` (application logic)
- `DevelopmentProvider` (port)
- `OpenAiDevelopmentProvider` (infrastructure implementation)

This module is responsible for converting structured analysis, technical design, and task breakdown inputs into concrete implementation changes and is imported into the root `AppModule`.

### TaskBreakdownModule

The `task-breakdown` domain is encapsulated as a dedicated feature module.

It groups all components required for the task breakdown flow:

- `TaskBreakdownController` (entrypoint)
- `TaskBreakdownUseCase` (application logic)
- `TaskBreakdownProvider` (port)
- `OpenAiTaskBreakdownProvider` (infrastructure implementation)

This module is responsible for converting structured analysis and technical design into executable team work and is imported into the root `AppModule`.

### AI Providers

The system uses a provider-based approach to interact with external AI services.

A shared port is defined per feature module:

- `AnalysisProvider` for `analyze`
- `RefinementProvider` for `refinement`
- `DevelopmentProvider` for `development`
- `TechnicalDesignProvider` for `technical-design`
- `TaskBreakdownProvider` for `task-breakdown`

Current implementations include:

- `OpenAiAnalysisProvider` (default)
- `OpenAiRefinementProvider` (default)
- `OpenAiDevelopmentProvider` (default)
- `OpenAiTechnicalDesignProvider` (default)
- `OpenAiTaskBreakdownProvider` (default)

The shared AI layer includes:

- `AiModule`
- `OpenAiStructuredExecutor`
- `OPENAI_CLIENT`
- `AI_RUNTIME_CONFIG`

Related ADR:

- `docs/adr/ADR-001-orchestrator-base-architecture.md`

### Provider Selection

The system currently uses OpenAI as its active AI provider across provider-backed feature modules.

Current scope note:

- OpenAI retry and error mapping are delegated to `OpenAiStructuredExecutor`
- provider-backed modules bind their feature port directly to the OpenAI implementation

### SystemModule

Encapsulates operational endpoints used for runtime visibility and health checks:

- `HealthController`
- `MetricsController`

This module is imported into the root `AppModule` alongside feature modules.

### Health Endpoints

The system exposes two health endpoints with different levels of detail.

#### Basic Health

`GET /health`

Returns a lightweight response intended for simple liveness checks.

Example response:

status: `ok`  
service: `ai-orchestrator`

#### Detailed Health

`GET /health/details`

Returns an extended runtime view of the system, including:

- overall system status (`ok`)
- configured primary provider
- metrics snapshot

This endpoint is intended for operational visibility and debugging, while `/health` remains suitable for simple probes.

---

## Layer Responsibilities

### Entrypoints

- Handle incoming requests (HTTP, events)
- Delegate to use cases

In the current implementation:

- controllers are intentionally thin
- use cases perform the explicit `text` presence/type validation
- analyze controller also records request count and latency metrics

Example:
- `analyze.controller.ts`
- `refinement.controller.ts`

---

### Application

- Contains use cases
- Orchestrates domain logic
- Can compose multiple use cases to implement agent orchestration flows
- Calls infrastructure providers

Example:
- `analyze.use-case.ts`
- `refine.use-case.ts`

---

### Domain

- Defines core types and contracts
- No dependency on frameworks or infrastructure

Example:
- `analyze.types.ts`
- `refinement.types.ts`

---

### Infrastructure

- Handles external integrations
- Calls OpenAI or other providers
- Maps external responses to domain models
- Validates structured AI outputs before returning them upstream

Example:
- `openai-analysis.provider.ts`
- `openai-refinement.provider.ts`

### AI Execution Layer

The system includes a shared execution layer for AI providers.

- `OpenAiStructuredExecutor` centralizes:
  - OpenAI API calls
  - timeout handling
  - structured response parsing
  - schema validation
  - retry for recoverable model-output errors
  - error mapping

This prevents duplication across providers and ensures consistent behavior.

Providers are responsible only for:
- defining prompts
- defining schemas
- invoking the executor

This design enables easier extension for future agents and shared configuration (e.g. language, retries).

### Shared AI Layer

The system includes a shared AI runtime layer for OpenAI execution concerns.

- `OpenAiStructuredExecutor` centralizes:
  - OpenAI API calls
  - timeout handling
  - structured response parsing
  - schema validation
  - retry for recoverable model-output errors
  - error mapping
- `OPENAI_CLIENT` and `AI_RUNTIME_CONFIG` are injected through `AiModule`

This keeps feature providers thin while avoiding duplicated OpenAI-execution logic.

---

## Design Principles

- Separation of concerns
- Explicit dependencies
- Minimal coupling
- Avoid premature abstraction
- Evolve architecture incrementally

---

## Future Evolution

The architecture may evolve towards:

- full hexagonal architecture (ports & adapters)
- multiple providers (OpenAI, Anthropic, etc.)
- broader retry and provider strategies
- richer structured validation layer
- observability and metrics
- configurable retries
- timeout handling for external provider calls
- agent orchestration pipelines (multi-step workflows)

## Related ADRs

- `docs/adr/ADR-001-orchestrator-base-architecture.md`
- `docs/adr/ADR-002-architectural-style.md`
- `docs/adr/ADR-003-response-validation-strategy.md`
- `docs/adr/ADR-004-feature-modules-in-nestjs.md`
- `docs/adr/ADR-005-multi-provider-strategy.md`
- `docs/adr/ADR-008-shared-provider-failover-executor.md`

---

## Observability

The system includes a lightweight observability layer to improve debugging and traceability.

### Logging

- structured logs (JSON format)
- log levels: info, error
- consistent log shape across modules

### Request Tracing

- each incoming request is assigned a `requestId`
- logs include `requestId` to allow end-to-end traceability

If an incoming `x-request-id` is provided by the caller, the system reuses it. Otherwise, a new request identifier is generated.

### Error Visibility

- provider errors are logged with context:
  - attempt number
  - error type
  - status codes

This approach enables basic observability without introducing external tooling, and serves as a foundation for future metrics and tracing systems.

### Metrics

The system includes basic in-memory metrics to provide visibility into runtime behavior.

Tracked metrics currently include:

- request count
- error count
- retry count
- fallback count (legacy metric; currently unused in runtime)
- average request latency
- error count grouped by technical error code

### Metrics Implementation

Metrics are implemented using a port-based approach.

- `MetricsRecorder` defines the contract for recording metrics
- `InMemoryMetricsService` provides a default in-memory implementation

This design allows replacing the metrics backend (e.g. Prometheus, external services) without affecting application logic.

A `/metrics` endpoint is exposed to retrieve current values.

These metrics are implemented in-memory and are intended as a lightweight foundation for future integration with external monitoring systems.

## Summary

This architecture provides a balance between:

- simplicity (to move fast)
- structure (to scale safely)

It avoids over-engineering while preparing the system for future complexity.
