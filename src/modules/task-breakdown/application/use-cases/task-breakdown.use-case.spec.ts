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

    expect(taskBreakdownProvider.breakdown).toHaveBeenCalledWith({
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

  it("should throw BadRequestException when source is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("should throw BadRequestException when source shape is invalid", async () => {
    await expect(
      useCase.execute({ source: { analysis: {} } } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should propagate provider errors", async () => {
    const error = new Error("provider failed");
    taskBreakdownProvider.breakdown.mockRejectedValue(error);

    await expect(
      useCase.execute({
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
      })
    ).rejects.toBe(error);
  });
});
