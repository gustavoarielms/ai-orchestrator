# AI Orchestrator

Platform for designing and building an AI agent orchestrator focused on Product & Engineering workflows.

The system transforms natural language requirements into structured deliverables ready for development.

---

## 🎯 Purpose

Reduce friction between an initial idea and its implementation by using AI agents orchestrated through a central controller.

---

## 🚀 MVP Scope

The MVP focuses on:

- A single endpoint: `/analyze`
- A single agent: `AnalysisAgent`
- Input: free text
- Structured output:
  - User Story
  - Acceptance Criteria
  - Technical Tasks

Example input:

    I need to implement OTP via WhatsApp with SMS fallback

Example output:

    {
      "userStory": "...",
      "acceptanceCriteria": ["..."],
      "tasks": ["..."]
    }

---

## Architecture

The project follows a modular architecture with hexagonal tendencies (hexagonal-light).

Each module is organized into:

- entrypoints (controllers)
- application (use cases)
- domain (types and contracts)
- infrastructure (external integrations)
- basic observability (logging + request tracing)
- basic metrics (requests, errors, retries)

Example structure:

    modules/
      analyze/
        entrypoints/
        application/
        domain/
        infrastructure/

For more details, see:
- `docs/architecture.md`
- `docs/adr/ADR-001-arquitectura-base.md`
- `docs/adr/ADR-002-architectural-style.md`

---

## 🤖 Agents

In the first version, a single agent is used:

- `AnalysisAgent`

Responsible for transforming a requirement into:

- user story
- acceptance criteria
- technical tasks

---

## 📦 Contracts

The system uses strict input and output contracts.

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

All outputs are validated before being returned.

---

## 📚 Documentation

Project documentation is available at:

- [Vision](docs/vision.md)
- [MVP Scope](docs/scope-mvp.md)
- [Architecture](docs/architecture.md)
- [Agents](docs/agents.md)
- [Contracts](docs/contracts.md)
- [ADR-001: Base Architecture](docs/adr/ADR-001-arquitectura-base.md)

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

- multiple agents (PO, TL, Dev)
- integration with tools (Jira, GitLab, Confluence)
- persistent memory
- full traceability
- OpenClaw as a gateway

---

## 🧠 Status

Project in design phase.

Currently defining:

- architecture
- contracts
- agent behavior

Next step: implementation of the `/analyze` endpoint.