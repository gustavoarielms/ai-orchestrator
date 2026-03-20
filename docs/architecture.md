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

---

## Summary

This architecture provides a balance between:

- simplicity (to move fast)
- structure (to scale safely)

It avoids over-engineering while preparing the system for future complexity.