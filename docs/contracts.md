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

### Endpoint

POST `/technical-design`

### Request Body

    {
      "source": {
        "userStory": "string",
        "acceptanceCriteria": ["string"],
        "tasks": ["string"]
      }
    }

### Rules

- `source` is required
- `userStory`, `acceptanceCriteria`, and `tasks` are required
- Represents structured analysis input that should be transformed into a technical design proposal

---

### Endpoint

POST `/development`

### Request Body

    {
      "analysis": {
        "userStory": "string",
        "acceptanceCriteria": ["string"],
        "tasks": ["string"]
      },
      "technicalDesign": {
        "architecture": "string",
        "components": ["string"],
        "risks": ["string"],
        "observability": ["string"],
        "rolloutPlan": ["string"]
      },
      "taskBreakdown": {
        "tasks": ["string"],
        "technicalApproach": "string",
        "tests": ["string"],
        "definitionOfDone": ["string"]
      },
      "implementationContext": {
        "framework": "nestjs",
        "language": "typescript",
        "testingFramework": "jest",
        "architectureStyle": "modular",
        "logging": "nestjs-logger"
      }
    }

### Rules

- `analysis`, `technicalDesign`, `taskBreakdown`, and `implementationContext` are required
- All nested fields must be present and typed correctly
- Represents a structured delivery scope that should be converted into executable development changes

---

### Endpoint

POST `/task-breakdown`

### Request Body

    {
      "source": {
        "analysis": {
          "userStory": "string",
          "acceptanceCriteria": ["string"],
          "tasks": ["string"]
        },
        "technicalDesign": {
          "architecture": "string",
          "components": ["string"],
          "risks": ["string"],
          "observability": ["string"],
          "rolloutPlan": ["string"]
        }
      }
    }

### Rules

- `source` is required
- `analysis` and `technicalDesign` are required
- All nested fields must be present and typed correctly
- Represents a structured technical scope that should be transformed into executable team work

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
      },
      "technicalDesign": {
        "architecture": "string",
        "components": ["string"],
        "risks": ["string"],
        "observability": ["string"],
        "rolloutPlan": ["string"]
      },
      "taskBreakdown": {
        "tasks": ["string"],
        "technicalApproach": "string",
        "tests": ["string"],
        "definitionOfDone": ["string"]
      },
      "summary": {
        "summary": "string",
        "recommendedApproach": "string",
        "keyRisks": ["string"],
        "deliveryOutline": ["string"]
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

#### technicalDesign

- Structured technical design result
- Must follow the `/technical-design` response contract exactly
- Must not be null

#### taskBreakdown

- Structured task breakdown result
- Must follow the `/task-breakdown` response contract exactly
- Must not be null

#### summary

- Deterministic executive summary built from the structured plan outputs
- Must not be null

---

### Endpoint

POST `/technical-design`

### Response Body

    {
      "architecture": "string",
      "components": ["string"],
      "risks": ["string"],
      "observability": ["string"],
      "rolloutPlan": ["string"]
    }

### Field Definitions

#### architecture

- Summary of the proposed architecture
- Must be clear and implementation-oriented
- Must not be empty

#### components

- Main technical components involved in the solution
- Each item must be a clear non-empty string
- Must not contain empty values

#### risks

- Relevant technical or delivery risks
- Each item must be a clear non-empty string
- Must not contain empty values

#### observability

- Monitoring, logging, or alerting recommendations
- Each item must be a clear non-empty string
- Must not contain empty values

#### rolloutPlan

- Ordered deployment or rollout considerations
- Each item must be a clear non-empty string
- Must not contain empty values

---

### Endpoint

POST `/development`

### Response Body

    {
      "filesToChange": ["string"],
      "codeChanges": [
        {
          "file": "string",
          "changeType": "create",
          "summary": "string",
          "content": "string"
        }
      ],
      "testsToAdd": [
        {
          "file": "string",
          "summary": "string",
          "content": "string"
        }
      ],
      "notes": ["string"]
    }

### Field Definitions

#### filesToChange

- List of files expected to be created or updated
- Each item must be a clear non-empty string
- Must not contain empty values

#### codeChanges

- Concrete file-level implementation changes
- Each item must include `file`, `changeType`, `summary`, and `content`
- `changeType` must be either `create` or `update`

#### testsToAdd

- Concrete tests that should be added
- Each item must include `file`, `summary`, and `content`

#### notes

- Additional implementation notes or caveats
- Each item must be a clear non-empty string
- Must not contain empty values

---

### Endpoint

POST `/task-breakdown`

### Response Body

    {
      "tasks": ["string"],
      "technicalApproach": "string",
      "tests": ["string"],
      "definitionOfDone": ["string"]
    }

### Field Definitions

#### tasks

- Concrete executable team work
- Each item must be a clear non-empty string
- Must not contain empty values

#### technicalApproach

- Short summary of the implementation approach
- Must be concrete and implementation-oriented
- Must not be empty

#### tests

- Relevant tests that should exist for the work
- Each item must be a clear non-empty string
- Must not contain empty values

#### definitionOfDone

- Conditions required to consider the work complete
- Each item must be a clear non-empty string
- Must not contain empty values

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
