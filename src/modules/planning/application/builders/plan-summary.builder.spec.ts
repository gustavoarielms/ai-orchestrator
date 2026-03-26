import { PlanSummaryBuilder } from "./plan-summary.builder";

describe("PlanSummaryBuilder", () => {
  it("builds a deterministic summary from planning artifacts", () => {
    const result = PlanSummaryBuilder.fromArtifacts(
      {
        problem: "Users need a backup channel for OTP delivery",
        goal: "Ensure OTP is delivered even if WhatsApp fails",
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        edgeCases: ["WhatsApp provider unavailable"]
      },
      {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      },
      {
        architecture: "Modular provider-backed delivery architecture",
        components: ["OTP orchestrator", "Channel provider adapter"],
        risks: ["Delivery provider outage"],
        observability: ["Delivery success metric"],
        rolloutPlan: ["Enable for beta users"]
      },
      {
        tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
        technicalApproach: "Usar un servicio único con estrategia por canal",
        tests: ["Unit tests para fallback"],
        definitionOfDone: ["OTP funcionando con observabilidad"]
      }
    );

    expect(result).toEqual({
      summary:
        "Ensure OTP is delivered even if WhatsApp fails. As a user, I want OTP delivery via WhatsApp with SMS fallback. La arquitectura recomendada es Modular provider-backed delivery architecture.",
      recommendedApproach: "Usar un servicio único con estrategia por canal",
      keyRisks: ["Delivery provider outage"],
      deliveryOutline: ["Implementar endpoint OTP", "Agregar fallback a SMS"]
    });
  });
});
