# ADR-004: Feature Modules in NestJS

## Status

Accepted

---

## Context

As the project grows, keeping all controllers, use cases, and dependency wiring in `AppModule` makes the application harder to maintain and scale.

The `analyze` flow already includes:

- an entrypoint
- application logic
- a provider port
- an infrastructure implementation

This makes it a good candidate to be encapsulated as a dedicated feature module.

---

## Decision

We adopt a **feature module approach** in NestJS.

Each relevant domain or feature should be encapsulated in its own module, responsible for grouping:

- controllers
- use cases
- dependency wiring
- infrastructure bindings related to that feature

The first module introduced under this approach is:

- `AnalyzeModule`

`AppModule` should remain focused on application bootstrap and high-level composition.

---

## Consequences

### Positive

- better separation of concerns
- cleaner `AppModule`
- easier scalability as new features are added
- more explicit dependency wiring

### Negative

- slightly more files and wiring
- requires discipline to avoid leaking responsibilities across modules

---

## Notes

This decision is structural and does not change the external API contract.

It establishes a modular foundation for future modules such as:

- configuration
- observability
- additional agent workflows