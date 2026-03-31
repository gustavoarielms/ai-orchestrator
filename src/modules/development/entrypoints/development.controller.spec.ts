import { DevelopmentController } from "./development.controller";
import { DevelopmentHandler } from "../application/ports/development-handler";
import { DevelopmentRequest } from "../domain/development.types";

describe("DevelopmentController", () => {
  let controller: DevelopmentController;
  let developmentUseCase: jest.Mocked<DevelopmentHandler>;

  const validInput: DevelopmentRequest = {
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
  };

  beforeEach(() => {
    developmentUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<DevelopmentHandler>;

    controller = new DevelopmentController(developmentUseCase);
  });

  it("should delegate to use case", async () => {
    developmentUseCase.execute.mockResolvedValue({
      filesToChange: ["src/modules/otp/otp.controller.ts"],
      codeChanges: [
        {
          file: "src/modules/otp/otp.controller.ts",
          changeType: "update",
          summary: "Agregar endpoint para solicitar OTP",
          content: "controller content"
        }
      ],
      testsToAdd: [
        {
          file: "src/modules/otp/otp.controller.spec.ts",
          summary: "Agregar tests del endpoint OTP",
          content: "test content"
        }
      ],
      notes: ["Validar métricas de entrega"]
    });

    const result = await controller.develop(validInput);

    expect(developmentUseCase.execute).toHaveBeenCalledWith(validInput);
    expect(result.filesToChange).toContain("src/modules/otp/otp.controller.ts");
  });

  it("should pass body through without breaking before use case validation", async () => {
    developmentUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.develop({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(developmentUseCase.execute).toHaveBeenCalledWith({} as any);
  });
});
