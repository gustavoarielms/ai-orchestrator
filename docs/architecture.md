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
- `ClaudeAnalysisProvider` (placeholder implementation)
- `FallbackAnalysisProvider` (failover wrapper)

This module is imported into the root `AppModule`, keeping the application composition clean and scalable.

### RefinementModule

The `refinement` domain is encapsulated as a dedicated feature module.

It groups all components required for the refinement flow:

- `RefinementController` (entrypoint)
- `RefineUseCase` (application logic)
- `RefinementProvider` (port)
- `OpenAiRefinementProvider` (infrastructure implementation)
- `ClaudeRefinementProvider` (placeholder implementation)
- `FallbackRefinementProvider` (failover wrapper)

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
- a consolidated response is returned

### AI Providers

The system uses a provider-based approach to interact with external AI services.

A shared port is defined per feature module:

- `AnalysisProvider` for `analyze`
- `RefinementProvider` for `refinement`

Current implementations include:

- `OpenAiAnalysisProvider` (default)
- `ClaudeAnalysisProvider` (placeholder)
- `OpenAiRefinementProvider` (default)
- `ClaudeRefinementProvider` (placeholder)

The active provider is selected via configuration:

AI_PROVIDER=openai | claude

Related ADR:

- `docs/adr/ADR-005-multi-provider-strategy.md`

### Provider Fallback

The system supports a configurable fallback strategy between providers.

If the primary provider fails and fallback is enabled, the system attempts the fallback provider before returning an error.

Relevant configuration:

AI_PROVIDER=openai  
AI_FALLBACK_ENABLED=true  
AI_FALLBACK_PROVIDER=claude  

Fallback behavior:

- primary provider is executed first  
- if it fails, fallback provider is invoked  
- fallback attempts are logged and tracked via metrics  
- if fallback also fails, the error is returned  

Provider resolution is handled at module level (`AnalyzeModule`, `RefinementModule`), while shared failover coordination is delegated to `ProviderFailoverExecutor`.

Current scope note:

- provider fallback and circuit breaker orchestration are implemented for both `analyze` and `refinement`
- both modules delegate failover behavior to a shared `ProviderFailoverExecutor`
- `ClaudeAnalysisProvider` is currently a placeholder that returns `501 Not Implemented`
- `ClaudeRefinementProvider` is currently a placeholder that returns `501 Not Implemented`

### SystemModule

Encapsulates operational endpoints used for runtime visibility and health checks:

- `HealthController`
- `MetricsController`
- `ResilienceController`

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

- overall system status (`ok` or `degraded`)
- configured primary provider
- fallback configuration
- circuit breaker states
- metrics snapshot

The detailed health status is calculated dynamically.

Current behavior:

- `ok` when all provider circuits are closed
- `degraded` when at least one provider circuit is open

This endpoint is intended for operational visibility and debugging, while `/health` remains suitable for simple probes.

#### Resilience Details

`GET /resilience/circuits`

Returns the current circuit breaker state for each known provider.

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
- `fallback-analysis.provider.ts`
- `fallback-refinement.provider.ts`

### AI Execution Layer

The system includes a shared execution layer for AI providers.

- `OpenAiStructuredExecutor` centralizes:
  - OpenAI API calls
  - timeout handling
  - structured response parsing
  - schema validation
  - error mapping

This prevents duplication across providers and ensures consistent behavior.

Providers are responsible only for:
- defining prompts
- defining schemas
- invoking the executor

This design enables easier extension for future agents and shared configuration (e.g. language, retries).

### Shared Resilience Layer

The system also includes a shared resilience layer for provider failover.

- `ProviderFailoverExecutor` centralizes:
  - primary/fallback execution order
  - circuit breaker checks
  - fallback metrics
  - provider failover logging

Feature-specific fallback providers delegate to this shared executor:

- `FallbackAnalysisProvider`
- `FallbackRefinementProvider`

This keeps feature providers thin while avoiding duplicated resilience logic.

Related ADRs:

- `docs/adr/ADR-006-provider-fallback-strategy.md`
- `docs/adr/ADR-007-provider-circuit-breaker.md`
- `docs/adr/ADR-008-shared-provider-failover-executor.md`

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
- broader retry and fallback strategies
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
- `docs/adr/ADR-006-provider-fallback-strategy.md`
- `docs/adr/ADR-007-provider-circuit-breaker.md`
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
- fallback count
- average request latency
- error count grouped by technical error code

### Metrics Implementation

Metrics are implemented using a port-based approach.

- `MetricsRecorder` defines the contract for recording metrics
- `InMemoryMetricsService` provides a default in-memory implementation

This design allows replacing the metrics backend (e.g. Prometheus, external services) without affecting application logic.

A `/metrics` endpoint is exposed to retrieve current values.

These metrics are implemented in-memory and are intended as a lightweight foundation for future integration with external monitoring systems.

### Circuit Breaker

The system includes a circuit breaker strategy for AI providers.

Its purpose is to avoid repeatedly calling providers that are currently failing.

Behavior:

- each provider has its own circuit state
- repeated failures increase the failure count
- once the configured threshold is reached, the circuit is opened
- while the circuit is open, execution against that provider is blocked
- after the configured reset timeout, the provider can be tried again in half-open mode
- a successful execution closes the circuit and resets the failure count

Relevant configuration:

AI_CIRCUIT_BREAKER_ENABLED=true  
AI_CIRCUIT_BREAKER_FAILURE_THRESHOLD=3  
AI_CIRCUIT_BREAKER_RESET_TIMEOUT_MS=30000  

The circuit breaker is applied during provider execution and works together with the fallback strategy.

Current circuit states can be inspected through:

`GET /resilience/circuits`

---

## Summary

This architecture provides a balance between:

- simplicity (to move fast)
- structure (to scale safely)

It avoids over-engineering while preparing the system for future complexity.
