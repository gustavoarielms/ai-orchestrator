# ADR-006: Provider Fallback Strategy

## Status

Accepted

---

## Context

The system supports multiple AI providers through feature-level provider ports such as:

- `AnalysisProvider`
- `RefinementProvider`

Initially, provider selection is driven by configuration (`AI_PROVIDER`), but this approach does not provide resilience in case of provider failure.

There is a need to:

- improve system reliability
- avoid total failure when a provider is unavailable
- support gradual rollout of new providers

---

## Decision

The system introduces a fallback strategy between providers.

A feature-level fallback provider is responsible for:

- invoking the primary provider
- catching failures
- delegating execution to a fallback provider if enabled

Examples:

- `FallbackAnalysisProvider`
- `FallbackRefinementProvider`

Fallback is controlled via configuration:

AI_PROVIDER=openai  
AI_FALLBACK_ENABLED=false  
AI_FALLBACK_PROVIDER=claude  

Fallback is applied only when:

- fallback is enabled
- primary and fallback providers are different
- the primary provider throws an error

The shared coordination of failover behavior may be delegated to shared resilience infrastructure.

---

## Consequences

### Positive

- improves system resilience
- reduces dependency on a single provider
- enables gradual adoption of new providers
- keeps use case logic unchanged
- allows the same fallback strategy to be reused across provider-enabled modules

### Negative

- adds complexity to provider resolution
- may introduce differences in response quality between providers
- fallback provider must be compatible with the expected output format

---

## Alternatives Considered

### 1. No fallback

Rejected because:

- the system fully depends on a single provider
- failures propagate directly to clients

### 2. Retry only

Rejected because:

- it does not address provider-level failures
- it is insufficient for quota or authentication errors

### 3. Fallback inside use case

Rejected because:

- it mixes orchestration with application logic
- it breaks separation of concerns

---

## Future Evolution

The fallback strategy may evolve to support:

- multiple fallback levels
- provider prioritization
- conditional fallback based on error type
- provider health tracking

---

## Notes

This decision extends the multi-provider architecture and reinforces the system’s hexagonal design by keeping fallback logic within the infrastructure layer.

Shared extraction of failover coordination is documented separately in:

- `ADR-008-shared-provider-failover-executor.md`
