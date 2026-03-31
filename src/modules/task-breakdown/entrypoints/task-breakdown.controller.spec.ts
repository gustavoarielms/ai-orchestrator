import { TaskBreakdownController } from "./task-breakdown.controller";
import { TaskBreakdownHandler } from "../application/ports/task-breakdown-handler";

describe("TaskBreakdownController", () => {
  let controller: TaskBreakdownController;
  let taskBreakdownUseCase: jest.Mocked<TaskBreakdownHandler>;

  beforeEach(() => {
    taskBreakdownUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TaskBreakdownHandler>;

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
      source: {
        analysis: {
          userStory:
            "As a user, I want OTP delivery via WhatsApp with SMS fallback",
          acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
          tasks: ["Implement fallback logic"]
        },
        technicalDesign: {
          architecture: "Modular provider-backed delivery architecture",
          components: ["OTP orchestrator", "Channel provider adapter"],
          risks: ["Delivery provider outage"],
          observability: ["Delivery success metric"],
          rolloutPlan: ["Enable for beta users"]
        }
      }
    });

    expect(taskBreakdownUseCase.execute).toHaveBeenCalledWith({
      source: {
        analysis: {
          userStory:
            "As a user, I want OTP delivery via WhatsApp with SMS fallback",
          acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
          tasks: ["Implement fallback logic"]
        },
        technicalDesign: {
          architecture: "Modular provider-backed delivery architecture",
          components: ["OTP orchestrator", "Channel provider adapter"],
          risks: ["Delivery provider outage"],
          observability: ["Delivery success metric"],
          rolloutPlan: ["Enable for beta users"]
        }
      }
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
