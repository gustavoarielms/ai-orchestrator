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

import { OpenAiAnalysisProvider } from "./openai-analysis.provider";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildAnalyzePrompt } from "./prompts/analyze.prompt";
import { AnalyzeResponseSchema } from "../domain/analyze.schema";

type MockOpenAiStructuredExecutor = Pick<
  jest.Mocked<OpenAiStructuredExecutor>,
  "execute"
>;

describe("OpenAiAnalysisProvider", () => {
  let provider: OpenAiAnalysisProvider;
  let openAiStructuredExecutor: MockOpenAiStructuredExecutor;

  beforeEach(() => {
    jest.clearAllMocks();
    openAiStructuredExecutor = {
      execute: jest.fn()
    };
    provider = new OpenAiAnalysisProvider(
      openAiStructuredExecutor as unknown as OpenAiStructuredExecutor
    );
  });

  it("should call OpenAiStructuredExecutor.execute", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });

    await provider.analyze({ text: "implement OTP login" });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should use operationName = "analyze_request"', async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });

    await provider.analyze({ text: "implement OTP login" });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        operationName: "analyze_request"
      })
    );
  });

  it("should use buildAnalyzePrompt(input)", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });

    const input = { text: "implement OTP login" };

    await provider.analyze(input);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: buildAnalyzePrompt(input)
      })
    );
  });

  it("should use AnalyzeResponseSchema", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });

    await provider.analyze({ text: "implement OTP login" });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: AnalyzeResponseSchema
      })
    );
  });

  it("should return executor result", async () => {
    const expected = {
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    };

    openAiStructuredExecutor.execute.mockResolvedValue(expected);

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(result).toEqual(expected);
  });

  it("should propagate executor errors", async () => {
    const error = new Error("executor failed");
    openAiStructuredExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBe(error);
  });
});
