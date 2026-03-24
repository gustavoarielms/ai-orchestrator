import { OpenAiDevelopmentProvider } from "./openai-development.provider";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildDevelopmentPrompt } from "./development.prompt";
import { DevelopmentResponseSchema } from "../domain/development.schema";
import { DevelopmentRequest } from "../domain/development.types";

describe("OpenAiDevelopmentProvider", () => {
  let provider: OpenAiDevelopmentProvider;
  let openAiStructuredExecutor: jest.Mocked<OpenAiStructuredExecutor>;

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
    openAiStructuredExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<OpenAiStructuredExecutor>;

    provider = new OpenAiDevelopmentProvider(openAiStructuredExecutor);
  });

  it("should call OpenAiStructuredExecutor.execute", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
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

    await provider.develop(validInput);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should use operationName = "development_request"', async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
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

    await provider.develop(validInput);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        operationName: "development_request"
      })
    );
  });

  it("should use buildDevelopmentPrompt(input)", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
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

    await provider.develop(validInput);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: buildDevelopmentPrompt(validInput)
      })
    );
  });

  it("should use DevelopmentResponseSchema", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
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

    await provider.develop(validInput);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: DevelopmentResponseSchema
      })
    );
  });
});
