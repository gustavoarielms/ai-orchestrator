import { BadRequestException } from "@nestjs/common";
import { AnalyzeUseCase } from "./analyze.use-case";
import { AnalysisProvider } from "../ports/analysis.provider";
import { MetricsRecorder } from "../../../../shared/metrics/ports/metrics-recorder";

describe("AnalyzeUseCase", () => {
  let useCase: AnalyzeUseCase;
  let provider: jest.Mocked<AnalysisProvider>;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;

  beforeEach(() => {
    provider = {
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

    useCase = new AnalyzeUseCase(provider, metricsRecorder);
  });

  it("should delegate to provider when input is valid", async () => {
    provider.analyze.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    const result = await useCase.execute({
      text: "implement OTP login"
    });

    expect(provider.analyze).toHaveBeenCalledWith({
      text: "implement OTP login"
    });

    expect(result).toEqual({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });
  });

  it("should throw when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
  });

  it("should throw when text is not a string", async () => {
    await expect(useCase.execute({ text: 123 as any })).rejects.toThrow(
      BadRequestException
    );
  });

  it("should increment metricsRecorder.incrementError using error.response.code when provider fails", async () => {
    const error = {
      response: {
        code: "openai_timeout"
      }
    };

    provider.analyze.mockRejectedValue(error);

    await expect(
      useCase.execute({ text: "implement OTP login" })
    ).rejects.toBe(error);

    expect(metricsRecorder.incrementError).toHaveBeenCalledWith("openai_timeout");
  });

  it("should increment metricsRecorder.incrementError using error.code when response.code does not exist", async () => {
    const error = {
      code: "openai_rate_limit_exceeded"
    };

    provider.analyze.mockRejectedValue(error);

    await expect(
      useCase.execute({ text: "implement OTP login" })
    ).rejects.toBe(error);

    expect(metricsRecorder.incrementError).toHaveBeenCalledWith(
      "openai_rate_limit_exceeded"
    );
  });

  it("should increment metricsRecorder.incrementError with unknown_error when no code exists", async () => {
    const error = new Error("unexpected failure");

    provider.analyze.mockRejectedValue(error);

    await expect(
      useCase.execute({ text: "implement OTP login" })
    ).rejects.toBe(error);

    expect(metricsRecorder.incrementError).toHaveBeenCalledWith("unknown_error");
  });

  it("should rethrow the original provider error", async () => {
    const error = new Error("provider failure");
    provider.analyze.mockRejectedValue(error);

    await expect(
      useCase.execute({ text: "implement OTP login" })
    ).rejects.toBe(error);
  });
});