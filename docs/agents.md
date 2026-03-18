# Agents Definition

## 🎯 Purpose

Definir los agentes que participan en el sistema, sus responsabilidades, inputs, outputs y límites.

Este documento establece los contratos de comportamiento para garantizar consistencia, control y escalabilidad en el orquestador.

---

## 🧠 Agent Strategy (MVP)

En la primera versión del sistema se implementará **un único agente**:

- `AnalysisAgent`

Este agente concentra las responsabilidades iniciales de análisis funcional y técnico.

La separación en múltiples agentes (PO, TL, Dev) se realizará en etapas posteriores.

---

## 🤖 AnalysisAgent

### 🧩 Role

Actuar como un analista híbrido (producto + técnico), capaz de transformar una necesidad en lenguaje natural en un entregable estructurado listo para el equipo de desarrollo.

---

### 📥 Input

    {
      "text": "string"
    }

Ejemplo:

    Necesito implementar OTP por WhatsApp fallback SMS

---

### 📤 Output

El agente debe devolver un JSON válido con la siguiente estructura:

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

---

### 📌 Responsibilities

- Interpretar correctamente la necesidad planteada
- Definir una user story clara y accionable
- Generar criterios de aceptación concretos y verificables
- Proponer tareas técnicas coherentes con la solución
- Mantener consistencia en el formato de salida

---

### 🚫 Constraints

- No debe inventar requerimientos fuera del contexto dado
- No debe ejecutar acciones externas
- No debe asumir detalles técnicos no inferibles
- No debe generar texto fuera del JSON definido
- No debe incluir explicaciones adicionales

---

### 🧠 Behavior Guidelines

- Priorizar claridad sobre creatividad
- Mantener outputs concisos
- Evitar ambigüedad en criterios de aceptación
- Las tareas deben ser implementables por un developer
- Usar lenguaje simple y directo

---

## 🔮 Future Evolution (Multi-Agent Model)

Una vez validado el MVP, el sistema evolucionará hacia múltiples agentes especializados:

---

### 🧑‍💼 PO Agent

#### Role

Refinamiento funcional y definición de producto.

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

Definición de arquitectura y diseño técnico.

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

Descomposición técnica e implementación.

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

- El orquestador es el único responsable de:
  - Invocar agentes
  - Validar outputs
  - Manejar errores
  - Controlar permisos
- Los agentes no tienen acceso directo a sistemas externos
- Todas las interacciones deben ser trazables

---

## 📌 Design Principles

- Agentes pequeños y especializados (a futuro)
- Outputs estrictamente tipados
- Sin side-effects
- Sin autonomía fuera del orquestador
- Evolución incremental del modelo