import { FallbackAnalysisProvider } from "./fallback-analysis.provider";
import { AnalysisProvider } from "../../application/ports/analysis.provider";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";
import { appConfig } from "../../../../config/app.config";

jest.mock("../../../../config/app.config", () => ({
  appConfig: {
    fallback: {
      enabled: true,
      provider: "claude"
    },
    aiProvider: "openai"
  }
}));

describe("FallbackAnalysisProvider", () => {
  let primaryProvider: jest.Mocked<AnalysisProvider>;
  let fallbackProvider: jest.Mocked<AnalysisProvider>;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;
  let provider: FallbackAnalysisProvider;

  beforeEach(() => {
    primaryProvider = {
      analyze: jest.fn()
    };

    fallbackProvider = {
      analyze: jest.fn()
    };

    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      incrementFallback: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn()
    };

    provider = new FallbackAnalysisProvider(
      primaryProvider,
      fallbackProvider,
      metricsRecorder
    );
  });

  it("should return primary provider response when successful", async () => {
    primaryProvider.analyze.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).not.toHaveBeenCalled();
    expect(result.userStory).toBe("As a user...");
  });

  it("should fallback when primary provider fails", async () => {
    primaryProvider.analyze.mockRejectedValue(new Error("Primary failed"));

    fallbackProvider.analyze.mockResolvedValue({
      userStory: "Fallback user story",
      acceptanceCriteria: ["Fallback criterion"],
      tasks: ["Fallback task"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(primaryProvider.analyze).toHaveBeenCalledTimes(1);
    expect(fallbackProvider.analyze).toHaveBeenCalledTimes(1);
    expect(metricsRecorder.incrementFallback).toHaveBeenCalledTimes(1);
    expect(result.userStory).toBe("Fallback user story");
  });
});