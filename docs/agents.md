# Agents Definition

## 🎯 Purpose

Define the agents participating in the system, their responsibilities, inputs, outputs, and constraints.

This document establishes behavioral contracts to ensure consistency, control, and scalability within the orchestrator.

---

## 🧠 Agent Strategy (MVP)

In the first version of the system, **a single agent** will be implemented:

- `AnalysisAgent`

This agent concentrates the initial functional and technical analysis responsibilities.

Separation into multiple agents (PO, TL, Dev) will be introduced in later stages.

---

## 🤖 AnalysisAgent

### 🧩 Role

Act as a hybrid analyst (product + technical), capable of transforming a natural language requirement into a structured deliverable ready for the development team.

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

- Correctly interpret the given requirement
- Define a clear and actionable user story
- Generate concrete and verifiable acceptance criteria
- Propose technical tasks aligned with the solution
- Maintain consistency in the output format

---

### 🚫 Constraints

- Must not invent requirements outside the given context
- Must not execute external actions
- Must not assume technical details that cannot be inferred
- Must not generate text outside the defined JSON
- Must not include additional explanations

---

### 🧠 Behavior Guidelines

- Prioritize clarity over creativity
- Keep outputs concise
- Avoid ambiguity in acceptance criteria
- Tasks must be implementable by a developer
- Use simple and direct language

---

## 🔮 Future Evolution (Multi-Agent Model)

Once the MVP is validated, the system will evolve towards multiple specialized agents:

---

### 🧑‍💼 PO Agent

#### Role

Functional refinement and product definition.

#### Output

    {
      "problem": "string",
      "goal": "string",
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "edgeCases": ["string"]
    }

---

### 🧑‍💻 TL Agent

#### Role

Architecture definition and technical design.

#### Output

    {
      "architecture": "string",
      "components": ["string"],
      "risks": ["string"],
      "observability": ["string"],
      "rolloutPlan": ["string"]
    }

---

### 👨‍💻 Dev Agent

#### Role

Technical breakdown and implementation.

#### Output

    {
      "tasks": ["string"],
      "technicalApproach": "string",
      "tests": ["string"],
      "definitionOfDone": ["string"]
    }

---

## 🔁 Orchestration Flow (Future)

    Input
      ↓
    PO Agent
      ↓
    TL Agent
      ↓
    Dev Agent
      ↓
    Final Output

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

- Small and specialized agents (future state)
- Strictly typed outputs
- No side-effects
- No autonomy outside the orchestrator
- Incremental evolution of the model