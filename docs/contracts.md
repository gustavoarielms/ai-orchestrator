# Contracts Definition

## 🎯 Purpose

Definir los contratos de entrada y salida del sistema, asegurando consistencia, validación y previsibilidad en la interacción entre componentes.

Este documento es la fuente de verdad para los formatos de datos utilizados por el orquestador y los agentes.

---

## 🧩 General Principles

- Todos los contratos deben ser explícitos y estrictos
- No se permiten campos adicionales fuera del esquema definido
- Los outputs deben ser siempre válidos y parseables
- Se prioriza simplicidad sobre flexibilidad
- El orquestador es responsable de validar todos los contratos

---

## 📥 Input Contract

### Endpoint

POST `/analyze`

### Request Body

    {
      "text": "string"
    }

### Rules

- `text` es obligatorio
- Debe ser un string no vacío
- Representa una necesidad funcional o técnica en lenguaje natural

---

## 📤 Output Contract

### Response Body

    {
      "userStory": "string",
      "acceptanceCriteria": ["string"],
      "tasks": ["string"]
    }

### Field Definitions

#### userStory

- Descripción clara del requerimiento
- Debe estar en formato entendible para negocio y desarrollo
- No debe estar vacío

#### acceptanceCriteria

- Lista de criterios verificables
- Cada elemento debe ser un string claro
- No debe contener elementos vacíos

#### tasks

- Lista de tareas técnicas necesarias para implementar la solución
- Cada tarea debe ser accionable por un developer
- No debe contener elementos vacíos

---

## 🚫 Validation Rules

- No se permiten propiedades adicionales
- Ningún campo puede ser null
- Ningún array puede contener valores vacíos
- El JSON debe ser válido y parseable sin transformación
- El output debe respetar exactamente la estructura definida

---

## 🔄 Error Handling Contract

### Error Response

    {
      "error": {
        "message": "string",
        "code": "string"
      }
    }

### Rules

- `message` debe describir el error de forma clara
- `code` debe ser un identificador técnico del error

---

## 🧠 Internal Normalization

El orquestador debe:

- Sanitizar inputs antes de enviarlos al modelo
- Validar outputs antes de retornarlos al cliente
- Rechazar respuestas que no cumplan el contrato
- Aplicar retries controlados en caso de outputs inválidos

---

## 🔐 Security Constraints

- No se debe ejecutar código basado en el output
- No se deben interpolar strings sin validación
- No se deben aceptar estructuras dinámicas
- No se debe confiar en el modelo sin validación previa

---

## 🔮 Future Extensions

El contrato podrá evolucionar para incluir:

- metadata adicional
- trazabilidad de agentes
- outputs multi-step
- referencias a tools ejecutadas

Cualquier cambio debe ser versionado explícitamente.

---

## 📌 Versioning Strategy

- Versión inicial: `v1`
- Cambios breaking requieren nueva versión (`v2`, `v3`, etc.)
- Cambios backward-compatible pueden agregarse sin romper contrato

---

## ✅ Success Criteria

Un contrato es correcto si:

- puede validarse automáticamente
- no requiere interpretación manual
- es consistente en todos los casos
- permite integrar otros sistemas sin ambigüedad