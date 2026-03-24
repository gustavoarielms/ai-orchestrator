import { OpenAiTaskBreakdownProvider } from "./openai-task-breakdown.provider";
import { OpenAiStructuredExecutor } from "../../../shared/ai/openai/openai-structured-executor";
import { buildTaskBreakdownPrompt } from "./prompts/task-breakdown.prompt";
import { TaskBreakdownResponseSchema } from "../domain/task-breakdown.schema";

describe("OpenAiTaskBreakdownProvider", () => {
  let provider: OpenAiTaskBreakdownProvider;
  let openAiStructuredExecutor: jest.Mocked<OpenAiStructuredExecutor>;

  beforeEach(() => {
    openAiStructuredExecutor = {
      execute: jest.fn()
    } as unknown as jest.Mocked<OpenAiStructuredExecutor>;

    provider = new OpenAiTaskBreakdownProvider(openAiStructuredExecutor);
  });

  it("should call OpenAiStructuredExecutor.execute", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await provider.breakdown({
      text: "Create executable team work from the technical design"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledTimes(1);
  });

  it('should use operationName = "task_breakdown_request"', async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await provider.breakdown({
      text: "Create executable team work from the technical design"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        operationName: "task_breakdown_request"
      })
    );
  });

  it("should use buildTaskBreakdownPrompt(input)", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    const input = {
      text: "Create executable team work from the technical design"
    };

    await provider.breakdown(input);

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: buildTaskBreakdownPrompt(input)
      })
    );
  });

  it("should use TaskBreakdownResponseSchema", async () => {
    openAiStructuredExecutor.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await provider.breakdown({
      text: "Create executable team work from the technical design"
    });

    expect(openAiStructuredExecutor.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: TaskBreakdownResponseSchema
      })
    );
  });

  it("should return executor result", async () => {
    const expected = {
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    };

    openAiStructuredExecutor.execute.mockResolvedValue(expected);

    const result = await provider.breakdown({
      text: "Create executable team work from the technical design"
    });

    expect(result).toEqual(expected);
  });

  it("should propagate executor errors", async () => {
    const error = new Error("executor failed");
    openAiStructuredExecutor.execute.mockRejectedValue(error);

    await expect(
      provider.breakdown({
        text: "Create executable team work from the technical design"
      })
    ).rejects.toBe(error);
  });
});
