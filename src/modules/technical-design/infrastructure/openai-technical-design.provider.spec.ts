import { OpenAiTechnicalDesignProvider } from "./openai-technical-design.provider";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildTechnicalDesignPrompt } from "./prompts/technical-design.prompt";
import { TechnicalDesignResponseSchema } from "../domain/technical-design.schema";

describe("OpenAiTechnicalDesignProvider", () => {
  let provider: OpenAiTechnicalDesignProvider;
  let openAiStructuredExecutor: jest.Mocked<OpenAiStructuredExecutor>;

  beforeEach(() => {
    openAiStructuredExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<OpenAiStructuredExecutor>;

    provider = new OpenAiTechnicalDesignProvider(openAiStructuredExecutor);
  });

  it("should call OpenAiStructuredExecutor.execute", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    await provider.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should use operationName = "technical_design_request"', async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    await provider.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        operationName: "technical_design_request"
      })
    );
  });

  it("should use buildTechnicalDesignPrompt(input)", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    const input = {
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    };

    await provider.design(input);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: buildTechnicalDesignPrompt(input)
      })
    );
  });

  it("should use TechnicalDesignResponseSchema", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    await provider.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: TechnicalDesignResponseSchema
      })
    );
  });

  it("should return executor result", async () => {
    const expected = {
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    };

    openAiStructuredExecutor.execute.mockResolvedValue(expected);

    const result = await provider.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(result).toEqual(expected);
  });

  it("should propagate executor errors", async () => {
    const error = new Error("executor failed");
    openAiStructuredExecutor.execute.mockRejectedValue(error);

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
