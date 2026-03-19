# ADR-001: Arquitectura Base del Orquestador

## Status

Accepted

---

## Context

Se requiere construir un sistema capaz de transformar necesidades en lenguaje natural en entregables estructurados para equipos de desarrollo.

El sistema debe:

- ser controlable
- ser predecible
- evitar comportamientos no determinísticos
- escalar hacia múltiples agentes en el futuro

Además, se busca evitar:

- lógica distribuida en el modelo
- ejecución autónoma sin control
- acoplamiento fuerte con proveedores externos

---

## Decision

Se adopta una arquitectura basada en un **Orchestrator central** que controla completamente la ejecución del sistema.

### Componentes principales

- **Client**
- **Orchestrator API**
- **Agent Layer**
- **OpenAI**
- **Validation Layer**

---

### Orchestrator como núcleo del sistema

El orquestador es responsable de:

- recibir requests
- validar inputs
- construir prompts
- invocar el modelo
- validar outputs
- manejar errores
- controlar el flujo completo

---

### Uso de un único agente (MVP)

En la primera versión se implementará un único agente:

- `AnalysisAgent`

Este agente se encargará de:

- interpretar la necesidad
- generar user story
- definir criterios de aceptación
- proponer tareas técnicas

---

### Contratos estrictos

Toda interacción estará definida por contratos explícitos:

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

### Validación obligatoria

El sistema no confiará en el output del modelo sin validación.

El orquestador deberá:

- validar estructura JSON
- validar campos obligatorios
- rechazar respuestas inválidas
- aplicar retries controlados si es necesario

---

### Sin ejecución directa del modelo

El modelo:

- no ejecuta acciones
- no tiene acceso a sistemas externos
- no controla el flujo

Toda acción pasa por el orquestador.

---

## Consequences

### Positivas

- alto control sobre el sistema
- comportamiento predecible
- facilidad para debuggear
- base sólida para escalar a múltiples agentes
- separación clara de responsabilidades

---

### Negativas

- mayor responsabilidad en el orquestador
- necesidad de implementar validación robusta
- posible incremento en complejidad al escalar

---

## Alternatives Considered

### 1. Agentes autónomos con tools

Se descartó porque:

- reduce control
- aumenta complejidad
- dificulta trazabilidad

---

### 2. Lógica distribuida en prompts

Se descartó porque:

- es difícil de mantener
- es difícil de testear
- no garantiza consistencia

---

### 3. Multi-agent desde el inicio

Se descartó porque:

- introduce complejidad innecesaria
- dificulta validar el valor del sistema

---

## Future Evolution

La arquitectura permitirá evolucionar hacia:

- múltiples agentes especializados (PO, TL, Dev)
- uso de tools controladas
- memoria persistente
- integración con sistemas externos
- trazabilidad completa

---

## Notes

Este ADR establece la base del sistema y no debe romperse sin la creación de un nuevo ADR que justifique el cambio.