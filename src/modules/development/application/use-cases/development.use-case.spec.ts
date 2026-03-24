import { BadRequestException } from "@nestjs/common";
import { DevelopmentUseCase } from "./development.use-case";
import { DevelopmentProvider } from "../ports/development.provider";
import { DevelopmentRequest } from "../../domain/development.types";

describe("DevelopmentUseCase", () => {
  let useCase: DevelopmentUseCase;
  let developmentProvider: jest.Mocked<DevelopmentProvider>;

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
    developmentProvider = {
      develop: jest.fn()
    };

    useCase = new DevelopmentUseCase(developmentProvider);
  });

  it("should delegate to provider with valid input", async () => {
    developmentProvider.develop.mockResolvedValue({
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

    const result = await useCase.execute(validInput);

    expect(developmentProvider.develop).toHaveBeenCalledWith(validInput);
    expect(result.filesToChange).toContain("src/modules/otp/otp.controller.ts");
  });

  it("should throw BadRequestException for invalid input", async () => {
    await expect(useCase.execute({} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("should propagate provider errors", async () => {
    const error = new Error("provider failed");
    developmentProvider.develop.mockRejectedValue(error);

    await expect(useCase.execute(validInput)).rejects.toBe(error);
  });
});
