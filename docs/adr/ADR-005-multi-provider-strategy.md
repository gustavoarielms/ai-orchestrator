# ADR-005: Multi-Provider Strategy for AI Integration

## Status

Accepted

---

## Context

The system currently relies on an AI provider to transform natural language input into structured outputs.

Initially, only OpenAI is used. However, there is a need to:

- support multiple AI providers (e.g. OpenAI, Claude)
- avoid coupling the system to a single vendor
- enable switching providers without impacting application logic

---

## Decision

The system adopts a **provider-based strategy** using a shared port:

- `AnalysisProvider`

Each provider implements this interface:

- `OpenAiAnalysisProvider`
- `ClaudeAnalysisProvider` (initially not implemented)

The active provider is selected through configuration:

```env
AI_PROVIDER=openai | claude