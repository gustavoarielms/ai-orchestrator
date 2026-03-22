jest.mock("../../../config/app.config", () => ({
  appConfig: {
    port: 3000,
    nodeEnv: "test",
    openai: {
      apiKey: "test-api-key",
      model: "gpt-5.4",
      timeoutMs: 10000,
      maxAttempts: 2
    }
  }
}));

import { BadRequestException, HttpException } from "@nestjs/common";
import { OpenAiAnalysisProvider } from "./openai-analysis.provider";
import { MetricsRecorder } from "../../../shared/metrics/ports/metrics-recorder";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";

type MockOpenAiStructuredExecutor = Pick<
  jest.Mocked<OpenAiStructuredExecutor>,
  "execute"
>;

describe("OpenAiAnalysisProvider", () => {
  let provider: OpenAiAnalysisProvider;
  let consoleErrorSpy: jest.SpyInstance;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;
  let openAiStructuredExecutor: MockOpenAiStructuredExecutor;

  beforeEach(() => {
    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn(),
      incrementFallback: jest.fn(),
    };

    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    openAiStructuredExecutor = {
      execute: jest.fn()
    };
    provider = new OpenAiAnalysisProvider(
      metricsRecorder,
      openAiStructuredExecutor as unknown as OpenAiStructuredExecutor
    );
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return parsed response when model output is valid", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(result).toEqual({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });
  });

  it("should retry once when model output is invalid", async () => {
    openAiStructuredExecutor.execute
      .mockRejectedValueOnce(
        new BadRequestException({
          statusCode: 400,
          message: "Model returned malformed JSON.",
          code: "openai_malformed_json"
        })
      )
      .mockResolvedValueOnce({
        userStory: "As a user, I want OTP login",
        acceptanceCriteria: ["OTP is sent"],
        tasks: ["Create endpoint"]
      });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(2);
    expect(metricsRecorder.incrementRetry).toHaveBeenCalledTimes(1);
    expect(result.userStory).toBe("As a user, I want OTP login");
  });

  it("should not retry when quota is exceeded", async () => {
    openAiStructuredExecutor.execute.mockRejectedValue({
      status: 429,
      code: "insufficient_quota"
    });

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(HttpException);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it("should map timeout errors to gateway timeout", async () => {
    openAiStructuredExecutor.execute.mockRejectedValue({
      name: "APIConnectionTimeoutError",
      message: "Request timed out"
    });

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toMatchObject({
      response: {
        statusCode: 504,
        code: "openai_timeout"
      }
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });
});
