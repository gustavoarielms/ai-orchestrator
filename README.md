# AI Orchestrator

Plataforma para diseñar y construir un orquestador de agentes de inteligencia artificial orientado a flujos de Product & Engineering.

El sistema transforma necesidades en lenguaje natural en entregables estructurados listos para desarrollo.

---

## 🎯 Purpose

Reducir la fricción entre la idea inicial y su implementación mediante el uso de agentes de IA controlados por un orquestador central.

---

## 🚀 MVP Scope

El MVP se enfoca en:

- Un único endpoint: `/analyze`
- Un único agente: `AnalysisAgent`
- Input: texto libre
- Output estructurado:
  - User Story
  - Acceptance Criteria
  - Technical Tasks

Ejemplo de input:

    Necesito implementar OTP por WhatsApp fallback SMS

Ejemplo de output:

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

En la primera versión se utiliza un único agente:

- `AnalysisAgent`

Responsable de transformar una necesidad en:

- user story
- criterios de aceptación
- tareas técnicas

---

## 📦 Contracts

El sistema utiliza contratos estrictos para entrada y salida.

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

Todos los outputs son validados antes de ser retornados.

---

## 📚 Documentation

La documentación del proyecto se encuentra en:

- [Vision](docs/vision.md)
- [MVP Scope](docs/scope-mvp.md)
- [Architecture](docs/architecture.md)
- [Agents](docs/agents.md)
- [Contracts](docs/contracts.md)
- [ADR-001: Arquitectura base](docs/adr/ADR-001-arquitectura-base.md)

---

## 🔐 Design Principles

- Simplicidad primero
- Control centralizado
- Contratos estrictos
- Sin side-effects
- Evolución incremental

---

## 🔮 Future Evolution

El sistema evolucionará hacia:

- múltiples agentes (PO, TL, Dev)
- integración con tools (Jira, GitLab, Confluence)
- memoria persistente
- trazabilidad completa
- OpenClaw como gateway

---

## 🧠 Status

Proyecto en fase de diseño.

Actualmente se está definiendo:

- arquitectura
- contratos
- comportamiento de agentes

Próximo paso: implementación del endpoint `/analyze`.