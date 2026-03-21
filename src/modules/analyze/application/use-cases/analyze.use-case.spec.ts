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
    await expect(useCase.execute({ text: 123 as any })).rejects.toThrow(BadRequestException);
  });
});