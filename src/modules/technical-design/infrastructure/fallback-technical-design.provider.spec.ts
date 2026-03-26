import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackTechnicalDesignProvider } from "./fallback-technical-design.provider";
import { TechnicalDesignProvider } from "../application/ports/technical-design.provider";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

describe("FallbackTechnicalDesignProvider", () => {
  let provider: FallbackTechnicalDesignProvider;
  let primaryProvider: jest.Mocked<TechnicalDesignProvider>;
  let fallbackProvider: jest.Mocked<TechnicalDesignProvider>;
  let providerFailoverExecutor: jest.Mocked<ProviderFailoverExecutor>;

  beforeEach(() => {
    primaryProvider = {
      design: jest.fn()
    };

    fallbackProvider = {
      design: jest.fn()
    };

    providerFailoverExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ProviderFailoverExecutor>;

    provider = new FallbackTechnicalDesignProvider(
      primaryProvider,
      fallbackProvider,
      providerFailoverExecutor
    );
  });

  it("should delegate execution to ProviderFailoverExecutor", async () => {
    providerFailoverExecutor.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    const result = await provider.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledTimes(1);
    expect(result.architecture).toContain("Modular NestJS");
  });

  it("should propagate errors from ProviderFailoverExecutor", async () => {
    const error = new ServiceUnavailableException({
      statusCode: 503,
      code: "provider_circuit_open"
    });

    providerFailoverExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.design({
        source: {
          userStory:
            "As a user, I want OTP delivery via WhatsApp with SMS fallback",
          acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
          tasks: ["Implement fallback logic"]
        }
      })
    ).rejects.toBe(error);
  });
});
