# ADR-008: Shared Provider Failover Executor

## Status

Accepted

---

## Context

The system already supports:

- multiple AI providers
- configurable provider fallback
- circuit breaker protection

Initially, failover behavior was implemented directly in feature-specific fallback providers, starting with `FallbackAnalysisProvider`.

As the same resilience pattern became necessary for `refinement`, keeping failover logic inside each feature module would introduce duplication and divergence.

At the same time, OpenAI-specific retry and provider selection concerns were starting to diverge between modules.

There is a need to:

- avoid duplicating fallback orchestration across modules
- keep concrete providers focused on prompt/schema execution
- centralize resilience behavior in a reusable component
- preserve thin feature-specific adapters while sharing failover strategy

---

## Decision

The system introduces a shared resilience component:

- `ProviderFailoverExecutor`

and keeps it inside a broader shared AI/resilience layer together with:

- `OpenAiStructuredExecutor`

This component centralizes:

- primary provider execution
- fallback provider execution
- circuit breaker validation
- provider success/failure recording
- fallback metrics
- failover logging

The surrounding shared AI layer centralizes:

- primary/fallback provider selection
- OpenAI structured execution
- retry for recoverable model-output errors
- provider-specific error mapping

Feature modules keep lightweight fallback wrappers that adapt domain-specific provider contracts to the shared executor:

- `FallbackAnalysisProvider`
- `FallbackRefinementProvider`

Concrete providers remain focused on model-specific execution:

- prompt construction
- schema selection
- invocation of shared AI executors

`PlanningModule` continues without its own provider abstraction and remains responsible only for use case orchestration.

---

## Consequences

### Positive

- reduces duplicated failover logic between feature modules
- keeps resilience behavior consistent across domains
- makes concrete providers smaller and easier to maintain
- improves architectural symmetry between `analyze` and `refinement`
- creates a reusable foundation for future provider-enabled modules
- keeps provider-specific policies out of feature modules

### Negative

- introduces an additional shared abstraction
- increases indirection when tracing provider execution
- requires dedicated tests to protect the shared failover behavior

---

## Alternatives Considered

### 1. Duplicate fallback providers per module

Rejected because:

- the same resilience flow would be reimplemented multiple times
- bug fixes would need to be repeated across modules
- behavior could diverge over time

### 2. Keep failover logic inside concrete providers

Rejected because:

- resilience is not the responsibility of model-specific providers
- providers should remain focused on prompt/schema/model interaction
- this would mix execution strategy with provider implementation details

### 3. Move failover into use cases

Rejected because:

- provider orchestration is an infrastructure concern
- use cases should remain provider-agnostic
- it would weaken separation of concerns

---

## Future Evolution

The shared failover executor may evolve to support:

- provider-specific failover policies
- conditional fallback based on error type
- multiple fallback levels
- shared abstractions for additional AI-enabled domains

---

## Notes

This decision builds on the existing fallback and circuit breaker ADRs by extracting their operational coordination into a shared reusable executor, while keeping feature modules explicit and domain-oriented.
