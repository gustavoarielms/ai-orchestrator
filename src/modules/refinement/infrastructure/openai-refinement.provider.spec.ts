import { OpenAiRefinementProvider } from "./openai-refinement.provider";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildRefinementPrompt } from "./prompts/refinement.prompt";
import { RefineResponseSchema } from "../domain/refinement.schema";

describe("OpenAiRefinementProvider", () => {
  let provider: OpenAiRefinementProvider;
  let openAiStructuredExecutor: jest.Mocked<OpenAiStructuredExecutor>;

  beforeEach(() => {
    openAiStructuredExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<OpenAiStructuredExecutor>;

    provider = new OpenAiRefinementProvider(openAiStructuredExecutor);
  });

  it("should call OpenAiStructuredExecutor.execute", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    await provider.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should use operationName = "refine_request"', async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    await provider.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        operationName: "refine_request"
      })
    );
  });

  it("should use buildRefinementPrompt(input)", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    const input = {
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    };

    await provider.refine(input);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: buildRefinementPrompt(input)
      })
    );
  });

  it("should use RefineResponseSchema", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    await provider.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: RefineResponseSchema
      })
    );
  });

  it("should return executor result", async () => {
    const expected = {
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    };

    openAiStructuredExecutor.execute.mockResolvedValue(expected);

    const result = await provider.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual(expected);
  });

  it("should propagate executor errors", async () => {
    const error = new Error("executor failed");
    openAiStructuredExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.refine({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);
  });
});