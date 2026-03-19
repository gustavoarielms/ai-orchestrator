# ADR-001: Orchestrator Base Architecture

## Status

Accepted

---

## Context

We need to build a system capable of transforming natural language requirements into structured deliverables for development teams.

The system must:

- be controllable
- be predictable
- avoid non-deterministic behavior
- scale to multiple agents in the future

Additionally, we want to avoid:

- business logic embedded in the model
- uncontrolled autonomous execution
- strong coupling with external providers

---

## Decision

We adopt an architecture based on a **central Orchestrator** that fully controls the system execution.

### Main Components

- **Client**
- **Orchestrator API**
- **Agent Layer**
- **OpenAI**
- **Validation Layer**

---

### Orchestrator as the system core

The orchestrator is responsible for:

- receiving requests
- validating inputs
- building prompts
- invoking the model
- validating outputs
- handling errors
- controlling the entire execution flow

---

### Single agent approach (MVP)

In the first version, a single agent will be implemented:

- `AnalysisAgent`

This agent is responsible for:

- interpreting the requirement
- generating the user story
- defining acceptance criteria
- proposing technical tasks

---

### Strict contracts

All interactions are defined through explicit contracts.

Input:

    {
      "text": "string"
    }

Output:

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

---

### Mandatory validation

The system does not trust model outputs without validation.

The orchestrator must:

- validate JSON structure
- validate required fields
- reject invalid responses
- apply controlled retries when necessary

---

### No direct model execution

The model:

- does not execute actions
- has no access to external systems
- does not control the workflow

All actions go through the orchestrator.

---

## Consequences

### Positive

- high system control
- predictable behavior
- easier debugging
- strong foundation for multi-agent scaling
- clear separation of responsibilities

---

### Negative

- increased responsibility in the orchestrator
- need for robust validation mechanisms
- potential increase in complexity as the system scales

---

## Alternatives Considered

### 1. Autonomous agents with tools

Rejected because:

- reduces control
- increases complexity
- makes traceability harder

---

### 2. Logic embedded in prompts

Rejected because:

- hard to maintain
- hard to test
- does not guarantee consistency

---

### 3. Multi-agent from the beginning

Rejected because:

- introduces unnecessary complexity
- makes it harder to validate system value early

---

## Future Evolution

The architecture allows evolution towards:

- multiple specialized agents (PO, TL, Dev)
- controlled tool usage
- persistent memory
- integration with external systems
- full traceability

---

## Notes

This ADR defines the foundation of the system and should not be changed without creating a new ADR that justifies the decision.