# Architecture Overview

## 🎯 Purpose

Describir la arquitectura de alto nivel del sistema, sus componentes principales, responsabilidades y flujo de interacción.

Este documento define cómo se organiza la solución en su primera versión y cómo podrá evolucionar en etapas posteriores.

---

## 🧩 High-Level Overview

La arquitectura propuesta para el MVP se basa en un enfoque simple y controlado:

1. Un cliente envía una necesidad en lenguaje natural
2. El orquestador recibe la solicitud
3. El orquestador invoca un agente de análisis usando OpenAI
4. El resultado se valida contra un contrato estricto
5. Se retorna una respuesta estructurada al cliente

---

## 🏗️ Main Components

### 1. Client

Componente que envía la solicitud al sistema.

Puede ser:

- una interfaz web
- una CLI
- una integración futura con OpenClaw
- cualquier consumidor HTTP

Responsabilidad principal:

- enviar texto libre al endpoint del orquestador

---

### 2. Orchestrator API

Componente central del sistema.

Responsabilidades:

- recibir requests
- validar input
- construir el contexto para el agente
- invocar OpenAI
- validar output
- manejar errores
- retornar la respuesta final

Este componente concentra el control del sistema y evita delegar lógica de negocio al modelo.

---

### 3. Agent Layer

Capa lógica que representa el comportamiento del agente.

En el MVP habrá un único agente:

- `AnalysisAgent`

Responsabilidades:

- transformar una necesidad en un entregable estructurado
- devolver una salida consistente y predecible

En futuras etapas esta capa podrá dividirse en:

- `POAgent`
- `TLAgent`
- `DevAgent`

---

### 4. OpenAI

Proveedor del razonamiento del sistema.

Responsabilidades:

- procesar el input enviado por el orquestador
- generar una respuesta estructurada
- ajustarse al formato esperado

El modelo no tiene control sobre ejecución, permisos ni llamadas a sistemas externos.

---

### 5. Validation Layer

Componente transversal responsable de asegurar que los datos cumplan contrato.

Responsabilidades:

- validar request input
- validar response output
- rechazar estructuras inválidas
- proteger al sistema contra respuestas no parseables o inconsistentes

---

## 🔁 MVP Flow

    Client
      ↓
    POST /analyze
      ↓
    Orchestrator API
      ↓
    Input Validation
      ↓
    AnalysisAgent
      ↓
    OpenAI
      ↓
    Output Validation
      ↓
    HTTP Response

---

## 📥 Input Flow

1. El cliente envía un texto libre al endpoint `/analyze`
2. El orquestador valida que el input cumpla contrato
3. Si el input es inválido, se rechaza antes de llegar al modelo
4. Si el input es válido, se construye la solicitud al agente

---

## 📤 Output Flow

1. OpenAI devuelve una respuesta
2. El orquestador intenta parsearla
3. Se valida contra el contrato definido en `contracts.md`
4. Si el output es válido, se retorna al cliente
5. Si el output es inválido, se rechaza o se reintenta de forma controlada

---

## 🔐 Control Principles

- El modelo no ejecuta acciones por sí mismo
- El orquestador mantiene el control completo del flujo
- Toda integración externa futura debe pasar por el orquestador
- Ningún output del modelo se considera confiable sin validación
- El sistema debe ser auditable y predecible

---

## 🧠 Design Decisions

### Simplicity First

La arquitectura inicial evita:

- múltiples agentes
- tools
- memoria persistente
- colas
- integraciones externas

Esto permite validar valor antes de aumentar complejidad.

### Centralized Control

Toda decisión operativa y técnica pasa por el orquestador.

### Strict Contracts

La comunicación entre componentes se basa en contratos explícitos.

### Incremental Evolution

La arquitectura está diseñada para evolucionar sin romper la base inicial.

---

## 🔮 Future Architecture Evolution

Una vez validado el MVP, la arquitectura podrá evolucionar incorporando:

- múltiples agentes especializados
- tools controladas por el orquestador
- memoria persistente
- trazabilidad de ejecuciones
- integración con Jira, GitLab, Confluence
- OpenClaw como gateway de entrada

Flujo futuro esperado:

    Client / OpenClaw
      ↓
    Orchestrator API
      ↓
    PO Agent
      ↓
    TL Agent
      ↓
    Dev Agent
      ↓
    Tools / Integrations
      ↓
    Final Response

---

## 📌 Non-Goals (MVP)

La arquitectura del MVP no busca resolver todavía:

- automatización end-to-end
- ejecución de acciones externas
- colaboración simultánea entre múltiples agentes
- uso de herramientas dinámicas
- optimización avanzada de costos o performance

---

## ✅ Success Criteria

La arquitectura será considerada correcta si:

- permite procesar solicitudes reales de forma consistente
- mantiene control centralizado del flujo
- valida estrictamente los contratos
- puede evolucionar a una arquitectura multi-agent sin reescritura total
- evita complejidad innecesaria en la primera versión