import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackDevelopmentProvider } from "./fallback-development.provider";
import { DevelopmentProvider } from "../application/ports/development.provider";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

describe("FallbackDevelopmentProvider", () => {
  let provider: FallbackDevelopmentProvider;
  let primaryProvider: jest.Mocked<DevelopmentProvider>;
  let fallbackProvider: jest.Mocked<DevelopmentProvider>;
  let providerFailoverExecutor: jest.Mocked<ProviderFailoverExecutor>;

  beforeEach(() => {
    primaryProvider = {
      develop: jest.fn()
    };

    fallbackProvider = {
      develop: jest.fn()
    };

    providerFailoverExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ProviderFailoverExecutor>;

    provider = new FallbackDevelopmentProvider(
      primaryProvider,
      fallbackProvider,
      providerFailoverExecutor
    );
  });

  it("should delegate execution to ProviderFailoverExecutor", async () => {
    providerFailoverExecutor.execute.mockResolvedValue({
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

    const result = await provider.develop({
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
    });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledTimes(1);
    expect(result.filesToChange).toContain("src/modules/otp/otp.controller.ts");
  });

  it("should propagate errors from ProviderFailoverExecutor", async () => {
    const error = new ServiceUnavailableException({
      statusCode: 503,
      code: "provider_circuit_open"
    });

    providerFailoverExecutor.execute.mockRejectedValue(error);

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
    ).rejects.toBe(error);
  });
});
