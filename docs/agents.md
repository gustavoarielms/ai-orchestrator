# Agents Definition

## 🎯 Purpose

Define the agents participating in the system, their responsibilities, inputs, outputs, and constraints.

This document establishes behavioral contracts to ensure consistency, control, and scalability within the orchestrator.

---

## 🧠 Agent Strategy (Current State)

The system currently supports multiple focused agents for requirement processing:

- `RefinementAgent`
- `AnalysisAgent`

These agents represent the first step toward a more specialized multi-agent architecture.

These agents can be composed through orchestration flows to produce consolidated outputs.

In the current codebase, these agents are implemented as application flows backed by providers rather than autonomous runtime agents with their own execution environment.

---

## 🤖 RefinementAgent

### 🧩 Role

Act as a functional refinement agent, transforming a raw requirement into a structured product definition.

---

### 📥 Input

    {
      "text": "string"
    }

Example:

    I need to implement OTP via WhatsApp with SMS fallback

---

### 📤 Output

The agent must return a valid JSON with the following structure:

    {
      "problem": "string",
      "goal": "string",
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "edgeCases": ["string"]
    }

---

### 📌 Responsibilities

- Identify and clarify the underlying problem
- Define the desired outcome (goal)
- Produce a consistent user story
- Generate functional acceptance criteria
- Surface relevant edge cases

---

### 🚫 Constraints

- Must not generate technical implementation tasks
- Must not invent business context beyond the input
- Must not include explanations outside the JSON
- Must not include markdown or extra formatting

---

### 🧠 Behavior Guidelines

- Focus on functional clarity
- Keep outputs structured and concise
- Avoid ambiguity in acceptance criteria
- Ensure edge cases are meaningful and realistic

---

## 🤖 AnalysisAgent

### 🧩 Role

Act as a hybrid technical analyst, transforming a requirement into a structured deliverable ready for implementation.

---

### 📥 Input

    {
      "text": "string"
    }

Example:

    I need to implement OTP via WhatsApp with SMS fallback

---

### 📤 Output

The agent must return a valid JSON with the following structure:

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

---

### 📌 Responsibilities

- Interpret the requirement from a technical perspective
- Define a clear and actionable user story
- Generate verifiable acceptance criteria
- Propose implementable technical tasks

---

### 🚫 Constraints

- Must not execute external actions
- Must not assume unsupported technical details
- Must not include explanations outside the JSON
- Must not include additional formatting

---

### 🧠 Behavior Guidelines

- Prioritize implementation clarity
- Keep tasks concrete and actionable
- Avoid ambiguity in acceptance criteria
- Use simple and direct language

---

## 🔁 Orchestration Flow (Current)

    Input
      ↓
    RefinementAgent
      ↓
    AnalysisAgent
      ↓
    Consolidated Output

### Notes

- Orchestration is implemented through the `PlanningModule`
- The `/plan` endpoint composes multiple agents
- Agents remain independent and reusable
- Orchestration is handled at the application layer (use cases), not at the API level

---

## 🔮 Future Evolution (Multi-Agent Model)

The system will evolve toward more specialized agents with clear responsibilities.

---

### 🧑‍💼 Refinement / PO Responsibility

Currently implemented through `RefinementAgent`.

May evolve to include:

- deeper business validation
- prioritization context
- stakeholder alignment logic

---

### 🧑‍💻 Technical Design Agent (TL)

#### Role

Architecture definition and technical design.

Status: implemented through the `TechnicalDesignModule` and `POST /technical-design`.

#### Output

    {
      "architecture": "string",
      "components": ["string"],
      "risks": ["string"],
      "observability": ["string"],
      "rolloutPlan": ["string"]
    }

---

### 👨‍💻 Task Breakdown Agent (Dev)

#### Role

Technical breakdown and implementation planning.

#### Output

    {
      "tasks": ["string"],
      "technicalApproach": "string",
      "tests": ["string"],
      "definitionOfDone": ["string"]
    }

---

## 🔐 Control & Governance

- The orchestrator is solely responsible for:
  - invoking agents
  - validating outputs
  - handling errors
  - controlling permissions
- Agents have no direct access to external systems
- All interactions must be traceable

---

## 📌 Design Principles

- Small and focused agents
- Strictly typed outputs
- No side-effects
- No autonomy outside the orchestrator
- Incremental evolution toward specialization
