# AI Orchestrator

Platform for designing and building an AI agent orchestrator focused on Product & Engineering workflows.

The system transforms natural language requirements into structured deliverables ready for development.

---

## 🎯 Purpose

Reduce friction between an initial idea and its implementation by using AI agents orchestrated through a central controller.

---

## 🚀 MVP Scope

The MVP currently supports:

- Three endpoints:
  - `POST /analyze`
  - `POST /refine`
  - `POST /plan`
- Two initial agents:
  - `AnalysisAgent`
  - `RefinementAgent`
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
      }
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
- basic metrics (requests, errors, retries, fallback)
- resilience mechanisms (fallback + circuit breaker)

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

These agents can be composed through orchestration flows to produce consolidated outputs.

---

## 📦 Contracts

All endpoints share a common input:

    {
      "text": "string"
    }

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
- provider abstraction for AI execution
- shared AI layer for provider resolution and structured execution
- fallback strategy for provider-enabled modules
- circuit breaker for resilience
- metrics and health visibility
- agent orchestration (`/plan`)

Notes about the current implementation:

- `/plan` orchestrates `refine -> analyze`
- structured output validation is enforced before returning AI responses
- `OpenAiStructuredExecutor` centralizes shared OpenAI retry, parsing, and error mapping
- fallback/circuit breaker behavior is implemented for both `analyze` and `refinement`
- `ProviderFailoverExecutor` centralizes shared failover behavior across provider-enabled modules
- `AiProviderResolver` centralizes provider selection across provider-enabled modules
- `ClaudeAnalysisProvider` exists as a placeholder and is not implemented yet
- `ClaudeRefinementProvider` exists as a placeholder and is not implemented yet

Next step:

- expand orchestration flows (multi-step pipelines)
- refine provider defaults and placeholder-provider strategy
- continue consolidating shared AI, resilience, and observability patterns
