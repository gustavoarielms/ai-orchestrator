import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackTaskBreakdownProvider } from "./fallback-task-breakdown.provider";
import { TaskBreakdownProvider } from "../application/ports/task-breakdown.provider";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

describe("FallbackTaskBreakdownProvider", () => {
  let provider: FallbackTaskBreakdownProvider;
  let primaryProvider: jest.Mocked<TaskBreakdownProvider>;
  let fallbackProvider: jest.Mocked<TaskBreakdownProvider>;
  let providerFailoverExecutor: jest.Mocked<ProviderFailoverExecutor>;

  beforeEach(() => {
    primaryProvider = {
      breakdown: jest.fn()
    };

    fallbackProvider = {
      breakdown: jest.fn()
    };

    providerFailoverExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ProviderFailoverExecutor>;

    provider = new FallbackTaskBreakdownProvider(
      primaryProvider,
      fallbackProvider,
      providerFailoverExecutor
    );
  });

  it("should delegate execution to ProviderFailoverExecutor", async () => {
    providerFailoverExecutor.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    const result = await provider.breakdown({
      source: {
        analysis: {
          userStory:
            "As a user, I want OTP delivery via WhatsApp with SMS fallback",
          acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
          tasks: ["Implement fallback logic"]
        },
        technicalDesign: {
          architecture: "Modular provider-backed delivery architecture",
          components: ["OTP orchestrator", "Channel provider adapter"],
          risks: ["Delivery provider outage"],
          observability: ["Delivery success metric"],
          rolloutPlan: ["Enable for beta users"]
        }
      }
    });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledTimes(1);
    expect(result.tasks).toContain("Implementar endpoint OTP");
  });

  it("should propagate errors from ProviderFailoverExecutor", async () => {
    const error = new ServiceUnavailableException({
      statusCode: 503,
      code: "provider_circuit_open"
    });

    providerFailoverExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.breakdown({
        source: {
          analysis: {
            userStory:
              "As a user, I want OTP delivery via WhatsApp with SMS fallback",
            acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
            tasks: ["Implement fallback logic"]
          },
          technicalDesign: {
            architecture: "Modular provider-backed delivery architecture",
            components: ["OTP orchestrator", "Channel provider adapter"],
            risks: ["Delivery provider outage"],
            observability: ["Delivery success metric"],
            rolloutPlan: ["Enable for beta users"]
          }
        }
      })
    ).rejects.toBe(error);
  });
});
