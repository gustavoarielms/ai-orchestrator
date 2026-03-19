# ADR-002: Architectural Style for AI Orchestrator

## Status

Accepted

## Context

The initial implementation of the AI Orchestrator started with a simple modular structure using controllers and services.

As the system evolved to integrate with external AI providers (OpenAI) and introduce domain-specific logic, the need for clearer separation of concerns became evident.

We want to:
- avoid tight coupling between business logic and infrastructure
- keep the system easy to evolve
- prevent over-engineering at early stages

## Decision

We adopt a **modular architecture with hexagonal tendencies (hexagonal-light)**.

The system will be organized into four main layers:

- **Entrypoints**
  - Responsible for handling external requests (HTTP, events, etc.)
  - Example: controllers

- **Application**
  - Contains use cases (orchestrates business logic)
  - No direct dependency on infrastructure details

- **Domain**
  - Defines core types and business contracts
  - No framework or external dependencies

- **Infrastructure**
  - Implements integrations with external systems (OpenAI, DB, APIs)

## Structure

    modules/
      analyze/
        entrypoints/
        application/
        domain/
        infrastructure/

## Consequences

### Positive

- Clear separation of responsibilities
- Easier to test and evolve
- Infrastructure can be replaced without impacting business logic
- Aligns with Clean Architecture principles

### Negative

- Slight increase in complexity vs simple service-based structure
- Requires discipline to maintain boundaries

## Notes

This is not a full hexagonal implementation (ports/adapters/interfaces everywhere).

We intentionally avoid:
- excessive abstraction
- premature interface design
- over-engineering

The architecture may evolve into a stricter hexagonal approach if needed.