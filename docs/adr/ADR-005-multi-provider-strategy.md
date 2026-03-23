# ADR-005: Multi-Provider Strategy for AI Integration

## Status

Accepted

---

## Context

The system currently relies on an AI provider to transform natural language input into structured outputs.

Initially, only OpenAI is used. However, there is a need to:

- support multiple AI providers (e.g. OpenAI, Claude)
- avoid coupling the system to a single vendor
- enable switching providers without impacting application logic

---

## Decision

The system adopts a **provider-based strategy** using feature-level provider ports:

- `AnalysisProvider`
- `RefinementProvider`

Concrete providers implement the corresponding feature port:

- `OpenAiAnalysisProvider`
- `ClaudeAnalysisProvider` (initially not implemented)
- `OpenAiRefinementProvider`
- `ClaudeRefinementProvider` (initially not implemented)

The active provider is selected through configuration:

```env
AI_PROVIDER=openai | claude
```

This strategy allows feature modules to remain provider-agnostic at the application layer while selecting the active implementation through infrastructure wiring.

---

## Consequences

### Positive

- avoids coupling application use cases to a single AI vendor
- allows feature modules to evolve independently while preserving a consistent provider pattern
- enables future reuse of shared failover and resilience infrastructure

### Negative

- adds more provider wiring at module level
- requires keeping contracts aligned across multiple provider implementations

---

## Notes

This ADR establishes the provider-based direction. Fallback orchestration and shared failover extraction are described separately in:

- `ADR-006-provider-fallback-strategy.md`
- `ADR-008-shared-provider-failover-executor.md`
