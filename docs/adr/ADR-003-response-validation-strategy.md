# ADR-003: Response Validation Strategy

## Status

Proposed

---

## Context

The AI Orchestrator relies on model-generated outputs to produce structured deliverables such as user stories, acceptance criteria, and technical tasks.

Model outputs are inherently unreliable unless explicitly validated. Even when instructed to return JSON, the model may still produce:

- invalid JSON
- missing required fields
- additional unexpected fields
- empty values
- incorrectly typed values
- explanatory text outside the expected structure

Without a validation strategy, these failures can:

- break the API contract
- produce inconsistent outputs
- increase debugging complexity
- make the system unsafe to integrate with downstream components

---

## Decision

We adopt a **strict response validation strategy** for all model-generated outputs.

The validation flow will include:

1. **Raw response extraction**
2. **Safe parsing**
3. **Schema validation**
4. **Controlled retry**
5. **Fail-fast response if validation still fails**

---

## Validation Flow

### 1. Raw response extraction

The system extracts the raw text returned by the model.

No downstream logic should operate directly on unvalidated model output.

---

### 2. Safe parsing

The orchestrator attempts to parse the response into JSON.

If the response is not valid JSON, the system must treat it as invalid output.

---

### 3. Schema validation

Once parsed, the response must be validated against a strict schema.

For the MVP, the expected schema is:

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

Validation rules include:

- all required fields must exist
- no field may be null
- arrays must contain only non-empty strings
- no additional properties are allowed

---

### 4. Controlled retry

If parsing or schema validation fails, the orchestrator may retry the model call in a controlled way.

Retry rules:

- retries are limited
- retries are only allowed for recoverable output errors
- retries must not be infinite
- retries should preserve observability and traceability

Examples of retryable failures:

- invalid JSON
- missing fields
- wrong field types
- empty structured output

Examples of non-retryable failures:

- authentication failure
- quota exhaustion
- permission errors
- infrastructure-level upstream failures

---

### 5. Fail-fast behavior

If validation still fails after the allowed retry attempts, the system must return a controlled error response.

The response must:

- preserve the API contract for errors
- expose a meaningful technical error code
- avoid leaking raw provider details unnecessarily

---

## Error Classification

The validation strategy distinguishes between:

### Provider Errors

Errors returned by OpenAI or another upstream provider.

Examples:

- authentication failure
- insufficient quota
- rate limit exceeded
- upstream timeout

These errors should be mapped to meaningful HTTP responses.

---

### Model Output Errors

Errors caused by malformed or invalid model output.

Examples:

- invalid JSON
- schema mismatch
- missing required fields
- unexpected structure

These errors should be treated as validation failures.

---

## Consequences

### Positive

- stronger contract enforcement
- more predictable API behavior
- easier debugging
- safer integration with downstream systems
- reduced risk of malformed AI responses leaking into the application flow

### Negative

- additional implementation complexity
- extra latency when retries are triggered
- need to maintain validation schemas as outputs evolve

---

## Alternatives Considered

### 1. Trust model output directly

Rejected because:

- it is unsafe
- it breaks API predictability
- it introduces inconsistent behavior

---

### 2. Parse best-effort and tolerate partial outputs

Rejected because:

- it weakens contracts
- it increases ambiguity
- it makes downstream behavior harder to reason about

---

### 3. Retry indefinitely until a valid response is returned

Rejected because:

- it is operationally unsafe
- it can increase cost uncontrollably
- it can hide real failures

---

## Implementation Direction

The implementation should introduce:

- a parsing layer
- a schema validation layer
- a retry policy for recoverable output errors
- consistent error mapping

A schema library such as **Zod** is a valid candidate for implementation.

---

## Future Evolution

This strategy may evolve to include:

- different schemas per agent
- structured outputs enforced at model level
- telemetry for validation failures
- retry backoff strategies
- fallback providers

---

## Notes

This ADR defines how the system should treat model output as untrusted until successfully validated.

No model response should be considered safe for application use until it passes parsing and schema validation.