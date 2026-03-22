# Refinement Module Class Diagram

```mermaid
classDiagram
    class RefinementController
    class RefineUseCase

    class RefinementProvider {
      <<interface>>
      +refine(input)
    }

    class OpenAiRefinementProvider

    RefinementController --> RefineUseCase
    RefineUseCase --> RefinementProvider

    OpenAiRefinementProvider ..|> RefinementProvider