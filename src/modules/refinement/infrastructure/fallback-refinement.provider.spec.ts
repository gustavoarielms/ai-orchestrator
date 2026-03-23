import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackRefinementProvider } from "./fallback-refinement.provider";
import { RefinementProvider } from "../application/ports/refinement.provider";
import { ProviderFailoverExecutor } from "../../../shared/resilience/executors/provider-failover-executor";

describe("FallbackRefinementProvider", () => {
  let provider: FallbackRefinementProvider;
  let primaryProvider: jest.Mocked<RefinementProvider>;
  let fallbackProvider: jest.Mocked<RefinementProvider>;
  let providerFailoverExecutor: jest.Mocked<ProviderFailoverExecutor>;

  beforeEach(() => {
    primaryProvider = {
      refine: jest.fn()
    };

    fallbackProvider = {
      refine: jest.fn()
    };

    providerFailoverExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ProviderFailoverExecutor>;

    provider = new FallbackRefinementProvider(
      primaryProvider,
      fallbackProvider,
      providerFailoverExecutor
    );
  });

  it("should delegate execution to ProviderFailoverExecutor", async () => {
    providerFailoverExecutor.execute.mockResolvedValue({
      problem: "Problem",
      goal: "Goal",
      userStory: "User story",
      acceptanceCriteria: ["Criterion 1"],
      edgeCases: ["Edge case 1"]
    });

    const result = await provider.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      problem: "Problem",
      goal: "Goal",
      userStory: "User story",
      acceptanceCriteria: ["Criterion 1"],
      edgeCases: ["Edge case 1"]
    });
  });

  it("should propagate errors from ProviderFailoverExecutor", async () => {
    const error = new ServiceUnavailableException({
      statusCode: 503,
      code: "provider_circuit_open"
    });

    providerFailoverExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.refine({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);
  });
});