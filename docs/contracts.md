# Contracts Definition

## 🎯 Purpose

Define the system's input and output contracts, ensuring consistency, validation, and predictability in interactions between components.

This document is the single source of truth for the data formats used by the orchestrator and agents.

---

## 🧩 General Principles

- All contracts must be explicit and strict
- No additional fields are allowed outside the defined schema
- Outputs must always be valid and parseable
- Simplicity is prioritized over flexibility
- The orchestrator is responsible for validating all contracts

---

## 📥 Input Contract

### Endpoint

POST `/analyze`

### Request Body

    {
      "text": "string"
    }

### Rules

- `text` is required
- Must be a non-empty string
- Represents a functional or technical requirement in natural language

---

### Endpoint

POST `/refine`

### Request Body

    {
      "text": "string"
    }

### Rules

- `text` is required
- Must be a non-empty string
- Represents a functional requirement to be refined

---

### Endpoint

POST `/plan`

### Request Body

    {
      "text": "string"
    }

### Rules

- `text` is required
- Must be a non-empty string
- Represents a requirement to be refined and analyzed through an orchestration flow

---

## 📤 Output Contract

### Endpoint

POST `/analyze`

### Response Body

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

### Field Definitions

#### userStory

- Clear description of the requirement
- Must be understandable for both business and engineering
- Must not be empty

#### acceptanceCriteria

- List of verifiable criteria
- Each item must be a clear string
- Must not contain empty values

#### tasks

- List of technical tasks required to implement the solution
- Each task must be actionable by a developer
- Must not contain empty values

---

### Endpoint

POST `/refine`

### Response Body

    {
      "problem": "string",
      "goal": "string",
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "edgeCases": ["string"]
    }

### Field Definitions

#### problem

- Description of the underlying problem
- Must be clear and concise
- Must not be empty

#### goal

- Desired outcome or objective
- Must be aligned with the problem
- Must not be empty

#### userStory

- User-centered description of the requirement
- Must be understandable for both business and engineering
- Must not be empty

#### acceptanceCriteria

- List of verifiable functional criteria
- Each item must be a clear string
- Must not contain empty values

#### edgeCases

- List of relevant edge scenarios
- Must capture boundary or exceptional conditions
- Must not contain empty values

---

### Endpoint

POST `/plan`

### Response Body

    {
      "refinement": {
        "problem": "string",
        "goal": "string",
        "userStory": "string",
        "acceptanceCriteria": ["string"],
        "edgeCases": ["string"]
      },
      "analysis": {
        "userStory": "string",
        "acceptanceCriteria": ["string"],
        "tasks": ["string"]
      }
    }

### Field Definitions

#### refinement

- Structured functional refinement result
- Must follow the `/refine` response contract exactly
- Must not be null

#### analysis

- Structured technical analysis result
- Must follow the `/analyze` response contract exactly
- Must not be null

---

## 🚫 Validation Rules

- No additional properties are allowed
- No field can be null
- Arrays must not contain empty values
- JSON must be valid and parseable without transformation
- Output must strictly match the defined structure

---

## 🔄 Error Handling Contract

### Error Response

    {
      "statusCode": 400,
      "message": "string",
      "code": "string"
    }

### Rules

- `statusCode` must represent the HTTP status returned by the API
- `message` must clearly describe the error
- `code` must be a technical identifier of the error

### Notes

- The service uses NestJS HTTP exceptions
- Error responses are returned as flat JSON payloads
- Validation and provider errors may include different `code` values depending on the failure

---

## 🧠 Internal Normalization

The orchestrator must:

- sanitize inputs before sending them to the model
- validate outputs before returning them to the client
- reject responses that do not comply with the contract
- apply controlled retries in case of invalid outputs

---

## 🔐 Security Constraints

- Do not execute code based on model output
- Do not interpolate strings without validation
- Do not accept dynamic structures
- Do not trust model output without prior validation

---

## 🔮 Future Extensions

The contract may evolve to include:

- additional metadata
- agent traceability
- multi-step outputs
- references to executed tools

Any change must be explicitly versioned.

---

## 📌 Versioning Strategy

- Initial version: `v1`
- Breaking changes require a new version (`v2`, `v3`, etc.)
- Backward-compatible changes can be introduced without breaking the contract

---

## ✅ Success Criteria

A contract is considered correct if:

- it can be automatically validated
- it does not require manual interpretation
- it is consistent across all cases
- it allows integration with other systems without ambiguity
