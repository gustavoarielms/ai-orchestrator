import { HttpException } from "@nestjs/common";
import { OpenAiAnalysisProvider } from "./openai-analysis.provider";
import { openai } from "../../../shared/openai/openai.client";

jest.mock("../../../shared/openai/openai.client", () => ({
  openai: {
    responses: {
      create: jest.fn()
    }
  }
}));

describe("OpenAiAnalysisProvider", () => {
  let provider: OpenAiAnalysisProvider;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    provider = new OpenAiAnalysisProvider();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return parsed response when model output is valid", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: JSON.stringify({
        userStory: "As a user, I want OTP login",
        acceptanceCriteria: ["OTP is sent"],
        tasks: ["Create endpoint"]
      })
    });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(result).toEqual({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent"],
      tasks: ["Create endpoint"]
    });
  });

  it("should retry once when model output is invalid", async () => {
    (openai.responses.create as jest.Mock)
      .mockResolvedValueOnce({
        output_text: "not valid json"
      })
      .mockResolvedValueOnce({
        output_text: JSON.stringify({
          userStory: "As a user, I want OTP login",
          acceptanceCriteria: ["OTP is sent"],
          tasks: ["Create endpoint"]
        })
      });

    const result = await provider.analyze({ text: "implement OTP login" });

    expect(openai.responses.create).toHaveBeenCalledTimes(2);
    expect(result.userStory).toBe("As a user, I want OTP login");
  });

  it("should not retry when quota is exceeded", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue({
      status: 429,
      code: "insufficient_quota"
    });

    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(HttpException);

    expect(openai.responses.create).toHaveBeenCalledTimes(1);
  });
});