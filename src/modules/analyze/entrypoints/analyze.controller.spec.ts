import { AnalyzeController } from "./analyze.controller";
import { AnalyzeHandler } from "../application/ports/analyze-handler";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";

describe("AnalyzeController", () => {
  let controller: AnalyzeController;
  let analyzeUseCase: jest.Mocked<AnalyzeHandler>;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;

  beforeEach(() => {
    analyzeUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<AnalyzeHandler>;

    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      incrementFallback: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn()
    };

    controller = new AnalyzeController(analyzeUseCase, metricsRecorder);
    jest.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(1200);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should delegate to use case and record metrics on success", async () => {
    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    const result = await controller.analyze({
      text: "implement OTP login"
    });

    expect(metricsRecorder.incrementRequest).toHaveBeenCalledTimes(1);
    expect(analyzeUseCase.execute).toHaveBeenCalledWith({
      text: "implement OTP login"
    });
    expect(metricsRecorder.recordLatency).toHaveBeenCalledWith(200);
    expect(result).toEqual({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });
  });

  it("should record latency and rethrow on error", async () => {
    const error = new Error("analyze failed");
    analyzeUseCase.execute.mockRejectedValue(error);

    await expect(
      controller.analyze({ text: "implement OTP login" })
    ).rejects.toBe(error);

    expect(metricsRecorder.incrementRequest).toHaveBeenCalledTimes(1);
    expect(metricsRecorder.recordLatency).toHaveBeenCalledWith(200);
  });

  it("should pass body through without breaking before use case validation", async () => {
    analyzeUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.analyze({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(analyzeUseCase.execute).toHaveBeenCalledWith({} as any);
  });

  it("should pass undefined body through without breaking before use case validation", async () => {
    analyzeUseCase.execute.mockRejectedValue(
        new Error("validation handled by use case")
    );

    await expect(controller.analyze(undefined as any)).rejects.toThrow(
        "validation handled by use case"
    );

    expect(analyzeUseCase.execute).toHaveBeenCalledWith(undefined);
    });
});
