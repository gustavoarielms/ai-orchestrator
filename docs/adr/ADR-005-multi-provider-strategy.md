# ADR-005: Multi-Provider Strategy for AI Integration

## Status

Accepted

---

## Context

The system relies on an AI provider to transform natural language input into structured outputs.

Initially, the architecture explored a path toward multiple providers. The main design need was to:

- support more than one AI provider
- avoid coupling the system to a single vendor
- preserve provider-agnostic application logic

---

## Decision

The system adopts a **provider-based strategy** using feature-level provider ports:

- `AnalysisProvider`
- `RefinementProvider`

Concrete providers implement the corresponding feature port:

- `OpenAiAnalysisProvider`
- `OpenAiRefinementProvider`

This strategy allows feature modules to remain provider-agnostic at the application layer while selecting the concrete implementation through infrastructure wiring.

---

## Consequences

### Positive

- avoids coupling application use cases to a single AI vendor
- allows feature modules to evolve independently while preserving a consistent provider pattern
- keeps room for future provider expansion if it becomes necessary

### Negative

- adds more provider wiring at module level
- future provider additions require keeping contracts aligned across implementations

---

## Notes

This ADR establishes the provider-based direction. Fallback orchestration and shared failover extraction are described separately in:

- `ADR-006-provider-fallback-strategy.md`
- `ADR-008-shared-provider-failover-executor.md`
