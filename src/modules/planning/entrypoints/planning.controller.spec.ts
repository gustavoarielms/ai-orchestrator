import { PlanningController } from "./planning.controller";
import { PlanRequirementUseCase } from "../application/use-cases/plan-requirement.use-case";

describe("PlanningController", () => {
  let controller: PlanningController;
  let planRequirementUseCase: jest.Mocked<PlanRequirementUseCase>;

  beforeEach(() => {
    planRequirementUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<PlanRequirementUseCase>;

    controller = new PlanningController(planRequirementUseCase);
  });

  it("should delegate to use case", async () => {
    planRequirementUseCase.execute.mockResolvedValue({
      refinement: {
        problem: "Users need a backup channel for OTP delivery",
        goal: "Ensure OTP is delivered even if WhatsApp fails",
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        edgeCases: ["WhatsApp provider unavailable"]
      },
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
      },
      taskBreakdown: {
        tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
        technicalApproach: "Usar un servicio único con estrategia por canal",
        tests: ["Unit tests para fallback"],
        definitionOfDone: ["OTP funcionando con observabilidad"]
      }
    });

    const result = await controller.plan({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(planRequirementUseCase.execute).toHaveBeenCalledWith({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual({
      refinement: {
        problem: "Users need a backup channel for OTP delivery",
        goal: "Ensure OTP is delivered even if WhatsApp fails",
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        edgeCases: ["WhatsApp provider unavailable"]
      },
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
      },
      taskBreakdown: {
        tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
        technicalApproach: "Usar un servicio único con estrategia por canal",
        tests: ["Unit tests para fallback"],
        definitionOfDone: ["OTP funcionando con observabilidad"]
      }
    });
  });

  it("should pass body through without breaking before use case validation", async () => {
    planRequirementUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.plan({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(planRequirementUseCase.execute).toHaveBeenCalledWith({} as any);
  });

  it("should pass undefined body through without breaking before use case validation", async () => {
    planRequirementUseCase.execute.mockRejectedValue(
        new Error("validation handled by use case")
    );

    await expect(controller.plan(undefined as any)).rejects.toThrow(
        "validation handled by use case"
    );

    expect(planRequirementUseCase.execute).toHaveBeenCalledWith(undefined);
    });
});
