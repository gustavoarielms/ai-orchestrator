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

---

## High-Level Flow

    HTTP Request
       ↓ 
    Controller (Entrypoint)
       ↓
    Use Case (Application)
       ↓
    Provider (Infrastructure)
       ↓
    External API (OpenAI)

---

## Module Structure

Each module follows this structure:

    modules/
      analyze/
        entrypoints/
        application/
        domain/
        infrastructure/

---

### AnalyzeModule

The `analyze` domain is encapsulated as a dedicated feature module.

It groups all components required for the analyze flow:

- `AnalyzeController` (entrypoint)
- `AnalyzeUseCase` (application logic)
- `AnalysisProvider` (port)
- `OpenAiAnalysisProvider` (infrastructure implementation)

This module is imported into the root `AppModule`, keeping the application composition clean and scalable.

### SystemModule

Encapsulates operational endpoints used for runtime visibility and health checks:

- `HealthController`
- `MetricsController`

This module is imported into the root `AppModule` alongside feature modules.

---

## Layer Responsibilities

### Entrypoints

- Handle incoming requests (HTTP, events)
- Validate input format
- Delegate to use cases

Example:
- `analyze.controller.ts`

---

### Application

- Contains use cases
- Orchestrates domain logic
- Calls infrastructure providers

Example:
- `analyze.use-case.ts`

---

### Domain

- Defines core types and contracts
- No dependency on frameworks or infrastructure

Example:
- `analyze.types.ts`

---

### Infrastructure

- Handles external integrations
- Calls OpenAI or other providers
- Maps external responses to domain models

Example:
- `openai-analysis.provider.ts`

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
- retry and fallback strategies
- structured validation layer
- observability and metrics
- configurable retries
- timeout handling for external provider calls

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
- average request latency
- error count grouped by technical error code

### Metrics Implementation

Metrics are implemented using a port-based approach.

- `MetricsRecorder` defines the contract for recording metrics
- `InMemoryMetricsService` provides a default in-memory implementation

This design allows replacing the metrics backend (e.g. Prometheus, external services) without affecting application logic.

A `/metrics` endpoint is exposed to retrieve current values.

These metrics are implemented in-memory and are intended as a lightweight foundation for future integration with external monitoring systems.

---

## Summary

This architecture provides a balance between:

- simplicity (to move fast)
- structure (to scale safely)

It avoids over-engineering while preparing the system for future complexity.