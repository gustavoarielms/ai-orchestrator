import { NotImplementedException } from "@nestjs/common";
import { ClaudeDevelopmentProvider } from "./claude-development.provider";

describe("ClaudeDevelopmentProvider", () => {
  let provider: ClaudeDevelopmentProvider;

  beforeEach(() => {
    provider = new ClaudeDevelopmentProvider();
  });

  it("should throw NotImplementedException", async () => {
    await expect(
      provider.develop({
        analysis: {
          userStory: "Como usuario quiero OTP por WhatsApp con fallback SMS",
          acceptanceCriteria: ["OTP por WhatsApp", "Fallback a SMS"],
          tasks: ["Implementar fallback", "Agregar métricas"]
        },
        technicalDesign: {
          architecture: "Arquitectura modular con strategy pattern",
          components: ["OTPService", "ProviderAdapter"],
          risks: ["Caída del proveedor"],
          observability: ["Métricas de entrega"],
          rolloutPlan: ["Habilitar con feature flag"]
        },
        taskBreakdown: {
          tasks: ["Crear endpoint", "Implementar fallback"],
          technicalApproach: "Encapsular envío en un servicio único",
          tests: ["Unit tests de selección de canal"],
          definitionOfDone: ["Fallback validado"]
        },
        implementationContext: {
          framework: "nestjs",
          language: "typescript",
          testingFramework: "jest",
          architectureStyle: "modular",
          logging: "nestjs-logger"
        }
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
