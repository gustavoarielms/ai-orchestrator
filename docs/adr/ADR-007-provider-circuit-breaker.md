# ADR-007: Provider Circuit Breaker Strategy

## Status

Accepted

---

## Context

The system already supports multiple AI providers and configurable fallback between them.

However, fallback alone is not enough when a provider is repeatedly failing. In that situation, the system would continue attempting calls against an unstable provider, increasing latency and unnecessary failures.

There is a need to:

- reduce repeated calls to failing providers
- improve resilience in provider orchestration
- expose provider runtime state for operational visibility

---

## Decision

The system introduces a circuit breaker strategy for AI providers.

A shared circuit breaker component is responsible for tracking provider state in memory.

Each provider can be in one of the following states:

- `closed`
- `open`
- `half-open`

Behavior:

- providers start in `closed` state
- each failure increments the failure count
- when the configured threshold is reached, the circuit transitions to `open`
- while `open`, execution against that provider is blocked
- after the configured reset timeout, the provider may be tried again in `half-open`
- if the half-open attempt succeeds, the circuit returns to `closed`
- if the half-open attempt fails, the circuit returns to `open`

Configuration:

AI_CIRCUIT_BREAKER_ENABLED=true  
AI_CIRCUIT_BREAKER_FAILURE_THRESHOLD=3  
AI_CIRCUIT_BREAKER_RESET_TIMEOUT_MS=30000  

Circuit breaker state is exposed through:

`GET /resilience/circuits`

---

## Consequences

### Positive

- reduces repeated calls to unstable providers
- improves resilience and latency under provider failure
- works naturally with the existing fallback strategy
- provides visibility into provider runtime state

### Negative

- adds orchestration complexity
- introduces in-memory state that is reset on application restart
- requires careful evolution if provider health becomes distributed across instances

---

## Alternatives Considered

### 1. Fallback only

Rejected because:
- fallback does not prevent repeated execution against unstable providers
- repeated provider failures still increase latency and noise

### 2. Retry only

Rejected because:
- retries address transient failures but do not model provider health over time
- repeated failures still result in unnecessary traffic to broken providers

### 3. Circuit breaker inside each provider

Rejected because:
- provider health is an orchestration concern
- circuit breaker behavior is better handled where provider selection and fallback are coordinated

---

## Future Evolution

The circuit breaker strategy may evolve to support:

- distributed/shared circuit state
- provider-specific thresholds
- conditional opening based on error type
- integration with external observability and alerting systems

---

## Notes

This decision complements the fallback strategy by preventing repeated execution against failing providers, while preserving the provider-agnostic contract used by application logic.