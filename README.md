# AI Orchestrator

Platform for designing and building an AI agent orchestrator focused on Product & Engineering workflows.

The system transforms natural language requirements into structured deliverables ready for development.

---

## 🎯 Purpose

Reduce friction between an initial idea and its implementation by using AI agents orchestrated through a central controller.

---

## 🚀 MVP Scope

The MVP currently supports:

- Six endpoints:
  - `POST /analyze`
  - `POST /refine`
  - `POST /development`
  - `POST /technical-design`
  - `POST /task-breakdown`
  - `POST /plan`
- Five initial agents:
  - `AnalysisAgent`
  - `RefinementAgent`
  - `DevelopmentAgent`
  - `TechnicalDesignAgent`
  - `TaskBreakdownAgent`
- Input: free text

### Outputs

**Analyze (technical perspective):**

    {
      "userStory": "...",
      "acceptanceCriteria": ["..."],
      "tasks": ["..."]
    }

**Refine (functional perspective):**

    {
      "problem": "...",
      "goal": "...",
      "userStory": "...",
      "acceptanceCriteria": ["..."],
      "edgeCases": ["..."]
    }

**Plan (orchestrated flow):**

    {
      "refinement": {
        "problem": "...",
        "goal": "...",
        "userStory": "...",
        "acceptanceCriteria": ["..."],
        "edgeCases": ["..."]
      },
      "analysis": {
        "userStory": "...",
        "acceptanceCriteria": ["..."],
        "tasks": ["..."]
      },
      "technicalDesign": {
        "architecture": "...",
        "components": ["..."],
        "risks": ["..."],
        "observability": ["..."],
        "rolloutPlan": ["..."]
      },
      "taskBreakdown": {
        "tasks": ["..."],
        "technicalApproach": "...",
        "tests": ["..."],
        "definitionOfDone": ["..."]
      },
      "summary": {
        "summary": "...",
        "recommendedApproach": "...",
        "keyRisks": ["..."],
        "deliveryOutline": ["..."]
      }
    }

**Technical Design (architecture perspective):**

    {
      "architecture": "...",
      "components": ["..."],
      "risks": ["..."],
      "observability": ["..."],
      "rolloutPlan": ["..."]
    }

**Development (code-oriented perspective):**

    {
      "filesToChange": ["..."],
      "codeChanges": [
        {
          "file": "...",
          "changeType": "create|update",
          "summary": "...",
          "content": "..."
        }
      ],
      "testsToAdd": [
        {
          "file": "...",
          "summary": "...",
          "content": "..."
        }
      ],
      "notes": ["..."]
    }

**Task Breakdown (execution perspective):**

    {
      "tasks": ["..."],
      "technicalApproach": "...",
      "tests": ["..."],
      "definitionOfDone": ["..."]
    }

---

## 🏗 Architecture

The project follows a modular architecture with hexagonal tendencies (hexagonal-light).

Each module is organized into:

- entrypoints (controllers)
- application (use cases)
- domain (types and contracts)
- infrastructure (external integrations)

The system also includes:

- structured logging
- request tracing
- basic metrics (requests, errors, retries)
- shared AI execution and provider selection

Example structure:

    modules/
      analyze/
        entrypoints/
        application/
        domain/
        infrastructure/
      refinement/
        entrypoints/
        application/
        domain/
        infrastructure/
      planning/
        entrypoints/
        application/
        domain/

For more details, see:
- `docs/architecture.md`
- `docs/adr/ADR-001-orchestrator-base-architecture.md`
- `docs/adr/ADR-002-architectural-style.md`

---

## 🤖 Agents

The system currently includes:

- `RefinementAgent` → functional definition (problem, goal, user story, acceptance criteria, edge cases)
- `AnalysisAgent` → technical analysis (user story, acceptance criteria, tasks)
- `DevelopmentAgent` → concrete code-oriented implementation proposal (files, changes, tests, notes)
- `TechnicalDesignAgent` → architecture definition (architecture, components, risks, observability, rollout plan)
- `TaskBreakdownAgent` → executable delivery plan (tasks, technical approach, tests, definition of done)

These agents can be composed through orchestration flows to produce consolidated outputs.

---

## 📦 Contracts

Most endpoints share a common input:

    {
      "text": "string"
    }

`POST /development` uses a structured input composed of `analysis`, `technicalDesign`, `taskBreakdown`, and `implementationContext`.

`POST /technical-design` uses a structured `source` built from analysis output.

`POST /task-breakdown` uses a structured `source` built from analysis and technical design output.

Outputs are strictly validated JSON structures defined per endpoint.

See full contracts in:

- `docs/contracts.md`

---

## 📚 Documentation

Project documentation is available at:

- [Vision](docs/vision.md)
- [MVP Scope](docs/scope-mvp.md)
- [Architecture](docs/architecture.md)
- [Agents](docs/agents.md)
- [Contracts](docs/contracts.md)
- [ADR-001: Base Architecture](docs/adr/ADR-001-orchestrator-base-architecture.md)

---

## 🔐 Design Principles

- Simplicity first
- Centralized control
- Strict contracts
- No side-effects
- Incremental evolution

---

## 🔮 Future Evolution

The system will evolve towards:

- specialized agents (technical design, task breakdown)
- agent orchestration pipelines
- integration with tools (Jira, GitLab, Confluence)
- persistent memory
- full traceability

---

## 🧠 Status

Project in active development.

Current capabilities:

- requirement refinement (`/refine`)
- technical analysis (`/analyze`)
- development generation (`/development`)
- technical design generation (`/technical-design`)
- task breakdown generation (`/task-breakdown`)
- provider abstraction for AI execution
- shared AI layer for provider resolution and structured execution
- metrics and health visibility
- agent orchestration (`/plan`)

Notes about the current implementation:

- `/plan` orchestrates `refine -> analyze -> technical-design -> task-breakdown`
- `/plan` also returns a deterministic executive summary built from the structured outputs
- structured output validation is enforced before returning AI responses
- `technical-design` is implemented as its own provider-backed feature module
- `development` is implemented as its own provider-backed feature module
- `task-breakdown` is implemented as its own provider-backed feature module
- `OpenAiStructuredExecutor` centralizes shared OpenAI retry, parsing, and error mapping
- provider-backed modules are currently implemented against OpenAI only

Next step:

- expand orchestration flows (multi-step pipelines)
- improve generation quality and repository-context awareness
- continue consolidating shared AI, planning, and development-context patterns
