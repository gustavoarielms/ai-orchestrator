# MVP Scope

## Objective

Validar que el sistema puede transformar una necesidad expresada en lenguaje natural en un entregable estructurado y útil para el equipo de desarrollo.

## In Scope

La primera versión del sistema incluirá:

- Un único endpoint de entrada
- Un único agente de análisis
- Integración con OpenAI para procesar texto
- Generación de una salida estructurada con:
  - User Story
  - Acceptance Criteria
  - Technical Tasks

## Out of Scope

La primera versión no incluirá:

- Múltiples agentes especializados
- Integración con Jira, GitLab o Confluence
- Memoria persistente
- Ejecución automática de acciones
- OpenClaw como gateway
- Paralelización de flujos
- Gestión avanzada de permisos

## Input

Texto libre con una necesidad funcional o técnica.

Ejemplo:

`Necesito implementar OTP por WhatsApp fallback SMS`

## Output

JSON estructurado con el siguiente formato:

```json
{
  "userStory": "string",
  "acceptanceCriteria": ["string"],
  "tasks": ["string"]
}