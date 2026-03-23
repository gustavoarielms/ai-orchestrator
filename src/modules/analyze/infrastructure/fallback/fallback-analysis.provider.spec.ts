import { ServiceUnavailableException } from "@nestjs/common";
import { FallbackAnalysisProvider } from "./fallback-analysis.provider";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { ProviderFailoverExecutor } from "../../../../shared/resilience/executors/provider-failover-executor";

jest.mock("../../../../config/app.config", () => ({
  appConfig: {
    fallback: {
      enabled: true,
      provider: "claude"
    },
    aiProvider: "openai"
  }
}));

import { appConfig } from "../../../../config/app.config";

describe("FallbackAnalysisProvider", () => {
  let primaryProvider: jest.Mocked<AnalysisProvider>;
  let fallbackProvider: jest.Mocked<AnalysisProvider>;
  let providerFailoverExecutor: jest.Mocked<ProviderFailoverExecutor>;
  let provider: FallbackAnalysisProvider;

  beforeEach(() => {
    primaryProvider = {
      analyze: jest.fn()
    };

    fallbackProvider = {
      analyze: jest.fn()
    };

    providerFailoverExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<ProviderFailoverExecutor>;

    provider = new FallbackAnalysisProvider(
      primaryProvider,
      fallbackProvider,
      providerFailoverExecutor
    );

    jest.clearAllMocks();
  });

  it("should return primary provider response when successful", async () => {
    const response = {
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    };
    providerFailoverExecutor.execute.mockResolvedValue(response);

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledWith({
      primaryProviderName: "openai",
      fallbackProviderName: "claude",
      fallbackEnabled: true,
      executePrimary: expect.any(Function),
      executeFallback: expect.any(Function)
    });
    expect(result.userStory).toBe("As a user...");
  });

  it("should pass current config to executor when fallback is disabled", async () => {
    (appConfig.fallback as any).enabled = false;
    providerFailoverExecutor.execute.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    await provider.analyze({ text: "implement OTP login" });

    expect(providerFailoverExecutor.execute).toHaveBeenCalledWith({
      primaryProviderName: "openai",
      fallbackProviderName: "claude",
      fallbackEnabled: false,
      executePrimary: expect.any(Function),
      executeFallback: expect.any(Function)
    });

    (appConfig.fallback as any).enabled = true;
  });

  it("should propagate 503 when executor rejects because circuit is open", async () => {
    providerFailoverExecutor.execute.mockRejectedValue(
      new ServiceUnavailableException()
    );

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("should propagate successful executor result", async () => {
    providerFailoverExecutor.execute.mockResolvedValue({
      userStory: "Fallback user story",
      acceptanceCriteria: ["Fallback criterion"],
      tasks: ["Fallback task"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(result.userStory).toBe("Fallback user story");
  });

  it("should propagate fallback error when executor fails", async () => {
    const fallbackError = new Error("Fallback failed");
    providerFailoverExecutor.execute.mockRejectedValue(fallbackError);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBe(fallbackError);
  });

  it("should wire primary and fallback executions to the executor", async () => {
    providerFailoverExecutor.execute.mockImplementation(async (params) => {
      const primaryResult = await params.executePrimary();
      const fallbackResult = await params.executeFallback();

      return fallbackResult ?? primaryResult;
    });

    primaryProvider.analyze.mockResolvedValue({
      userStory: "Primary user story",
      acceptanceCriteria: ["Primary criterion"],
      tasks: ["Primary task"]
    });
    fallbackProvider.analyze.mockResolvedValue({
      userStory: "Fallback user story",
      acceptanceCriteria: ["Fallback criterion"],
      tasks: ["Fallback task"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(primaryProvider.analyze).toHaveBeenCalledWith({
      text: "implement OTP login"
    });
    expect(fallbackProvider.analyze).toHaveBeenCalledWith({
      text: "implement OTP login"
    });
    expect(result.userStory).toBe("Fallback user story");
  });
});
