import { BadRequestException } from "@nestjs/common";
import { TaskBreakdownUseCase } from "./task-breakdown.use-case";
import { TaskBreakdownProvider } from "../ports/task-breakdown.provider";

describe("TaskBreakdownUseCase", () => {
  let useCase: TaskBreakdownUseCase;
  let taskBreakdownProvider: jest.Mocked<TaskBreakdownProvider>;

  beforeEach(() => {
    taskBreakdownProvider = {
      breakdown: jest.fn()
    };

    useCase = new TaskBreakdownUseCase(taskBreakdownProvider);
  });

  it("should delegate to provider with valid input", async () => {
    taskBreakdownProvider.breakdown.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    const result = await useCase.execute({
      text: "Create executable team work from the technical design"
    });

    expect(taskBreakdownProvider.breakdown).toHaveBeenCalledWith({
      text: "Create executable team work from the technical design"
    });
    expect(result.tasks).toContain("Implementar endpoint OTP");
  });

  it("should throw BadRequestException when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("should throw BadRequestException when text is not a string", async () => {
    await expect(useCase.execute({ text: 123 as any })).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("should propagate provider errors", async () => {
    const error = new Error("provider failed");
    taskBreakdownProvider.breakdown.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Create executable team work from the technical design"
      })
    ).rejects.toBe(error);
  });
});
