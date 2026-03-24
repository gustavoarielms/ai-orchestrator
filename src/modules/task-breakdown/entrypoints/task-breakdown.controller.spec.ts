import { TaskBreakdownController } from "./task-breakdown.controller";
import { TaskBreakdownUseCase } from "../application/use-cases/task-breakdown.use-case";

describe("TaskBreakdownController", () => {
  let controller: TaskBreakdownController;
  let taskBreakdownUseCase: jest.Mocked<TaskBreakdownUseCase>;

  beforeEach(() => {
    taskBreakdownUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TaskBreakdownUseCase>;

    controller = new TaskBreakdownController(taskBreakdownUseCase);
  });

  it("should delegate to use case", async () => {
    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    const result = await controller.breakdown({
      text: "Create executable team work from the technical design"
    });

    expect(taskBreakdownUseCase.execute).toHaveBeenCalledWith({
      text: "Create executable team work from the technical design"
    });
    expect(result.tasks).toContain("Implementar endpoint OTP");
  });

  it("should pass body through without breaking before use case validation", async () => {
    taskBreakdownUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.breakdown({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(taskBreakdownUseCase.execute).toHaveBeenCalledWith({} as any);
  });

  it("should pass undefined body through without breaking before use case validation", async () => {
    taskBreakdownUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.breakdown(undefined as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(taskBreakdownUseCase.execute).toHaveBeenCalledWith(undefined);
  });
});
