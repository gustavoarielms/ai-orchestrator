import { BadRequestException } from "@nestjs/common";
import { PlanRequirementUseCase } from "./plan-requirement.use-case";
import { RefineUseCase } from "../../../refinement/application/use-cases/refine.use-case";
import { AnalyzeUseCase } from "../../../analyze/application/use-cases/analyze.use-case";
import { TechnicalDesignUseCase } from "../../../technical-design/application/use-cases/technical-design.use-case";
import { TaskBreakdownUseCase } from "../../../task-breakdown/application/use-cases/task-breakdown.use-case";

describe("PlanRequirementUseCase", () => {
  let useCase: PlanRequirementUseCase;
  let refineUseCase: jest.Mocked<RefineUseCase>;
  let analyzeUseCase: jest.Mocked<AnalyzeUseCase>;
  let technicalDesignUseCase: jest.Mocked<TechnicalDesignUseCase>;
  let taskBreakdownUseCase: jest.Mocked<TaskBreakdownUseCase>;

  beforeEach(() => {
    refineUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<RefineUseCase>;

    analyzeUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<AnalyzeUseCase>;

    technicalDesignUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TechnicalDesignUseCase>;

    taskBreakdownUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TaskBreakdownUseCase>;

    useCase = new PlanRequirementUseCase(
      refineUseCase,
      analyzeUseCase,
      technicalDesignUseCase,
      taskBreakdownUseCase
    );
  });

  it("should throw BadRequestException when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException when text is not a string", async () => {
    await expect(
      useCase.execute({ text: 123 as any })
    ).rejects.toThrow(BadRequestException);
  });

  it("should call refine, then analyze, then technical design, then task breakdown", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refineUseCase.execute).toHaveBeenCalledTimes(1);
    expect(analyzeUseCase.execute).toHaveBeenCalledTimes(1);
    expect(technicalDesignUseCase.execute).toHaveBeenCalledTimes(1);
    expect(taskBreakdownUseCase.execute).toHaveBeenCalledTimes(1);

    expect(refineUseCase.execute).toHaveBeenCalledWith({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refineUseCase.execute.mock.invocationCallOrder[0]).toBeLessThan(
      analyzeUseCase.execute.mock.invocationCallOrder[0]
    );
    expect(analyzeUseCase.execute.mock.invocationCallOrder[0]).toBeLessThan(
      technicalDesignUseCase.execute.mock.invocationCallOrder[0]
    );
    expect(technicalDesignUseCase.execute.mock.invocationCallOrder[0]).toBeLessThan(
      taskBreakdownUseCase.execute.mock.invocationCallOrder[0]
    );
  });

  it("should build enriched analysis input from refinement output", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      edgeCases: [
        "WhatsApp provider unavailable",
        "SMS provider unavailable"
      ]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(analyzeUseCase.execute).toHaveBeenCalledWith({
      text: [
        "Problem: Users need a backup channel for OTP delivery",
        "Goal: Ensure OTP is delivered even if WhatsApp fails",
        "User Story: As a user, I want OTP delivery via WhatsApp with SMS fallback",
        "Acceptance Criteria: OTP is first attempted via WhatsApp; If WhatsApp fails, SMS is used",
        "Edge Cases: WhatsApp provider unavailable; SMS provider unavailable"
      ].join("\n")
    });

  });

  it("should build technical design input from analysis output", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      edgeCases: [
        "WhatsApp provider unavailable",
        "SMS provider unavailable"
      ]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      tasks: ["Implement fallback logic", "Add provider observability"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(technicalDesignUseCase.execute).toHaveBeenCalledWith({
      text: [
        "User Story: As a user, I want OTP delivery via WhatsApp with SMS fallback",
        "Acceptance Criteria: OTP is first attempted via WhatsApp; If WhatsApp fails, SMS is used",
        "Tasks: Implement fallback logic; Add provider observability"
      ].join("\n")
    });
  });

  it("should build task breakdown input from analysis and technical design output", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      edgeCases: [
        "WhatsApp provider unavailable",
        "SMS provider unavailable"
      ]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      tasks: ["Implement fallback logic", "Add provider observability"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(taskBreakdownUseCase.execute).toHaveBeenCalledWith({
      text: [
        "User Story: As a user, I want OTP delivery via WhatsApp with SMS fallback",
        "Acceptance Criteria: OTP is first attempted via WhatsApp; If WhatsApp fails, SMS is used",
        "Tasks: Implement fallback logic; Add provider observability",
        "Architecture: Modular provider-backed delivery architecture",
        "Components: OTP orchestrator; Channel provider adapter",
        "Risks: Delivery provider outage",
        "Observability: Delivery success metric",
        "Rollout Plan: Enable for beta users"
      ].join("\n")
    });
  });

  it("should return refinement, analysis, technicalDesign, and taskBreakdown", async () => {
    const refinement = {
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    };

    const analysis = {
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    };

    const technicalDesign = {
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    };

    const taskBreakdown = {
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    };

    refineUseCase.execute.mockResolvedValue(refinement);
    analyzeUseCase.execute.mockResolvedValue(analysis);
    technicalDesignUseCase.execute.mockResolvedValue(technicalDesign);
    taskBreakdownUseCase.execute.mockResolvedValue(taskBreakdown);

    const result = await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual({
      refinement,
      analysis,
      technicalDesign,
      taskBreakdown,
      summary: {
        summary:
          "Ensure OTP is delivered even if WhatsApp fails. As a user, I want OTP delivery via WhatsApp with SMS fallback. La arquitectura recomendada es Modular provider-backed delivery architecture.",
        recommendedApproach: "Usar un servicio único con estrategia por canal",
        keyRisks: ["Delivery provider outage"],
        deliveryOutline: ["Implementar endpoint OTP", "Agregar fallback a SMS"]
      }
    });
  });

  it("should build deterministic summary from existing outputs", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    taskBreakdownUseCase.execute.mockResolvedValue({
      tasks: ["Implementar endpoint OTP", "Agregar fallback a SMS"],
      technicalApproach: "Usar un servicio único con estrategia por canal",
      tests: ["Unit tests para fallback"],
      definitionOfDone: ["OTP funcionando con observabilidad"]
    });

    const result = await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result.summary).toEqual({
      summary:
        "Ensure OTP is delivered even if WhatsApp fails. As a user, I want OTP delivery via WhatsApp with SMS fallback. La arquitectura recomendada es Modular provider-backed delivery architecture.",
      recommendedApproach: "Usar un servicio único con estrategia por canal",
      keyRisks: ["Delivery provider outage"],
      deliveryOutline: ["Implementar endpoint OTP", "Agregar fallback a SMS"]
    });
  });

  it("should propagate error if refine fails", async () => {
    const error = new Error("Refinement failed");
    refineUseCase.execute.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);

    expect(analyzeUseCase.execute).not.toHaveBeenCalled();
    expect(technicalDesignUseCase.execute).not.toHaveBeenCalled();
    expect(taskBreakdownUseCase.execute).not.toHaveBeenCalled();
  });

  it("should not call analyze if refine fails", async () => {
    refineUseCase.execute.mockRejectedValue(new Error("Refinement failed"));

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toThrow("Refinement failed");

    expect(analyzeUseCase.execute).not.toHaveBeenCalled();
    expect(technicalDesignUseCase.execute).not.toHaveBeenCalled();
    expect(taskBreakdownUseCase.execute).not.toHaveBeenCalled();
  });

  it("should propagate error if analyze fails", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    const error = new Error("Analysis failed");
    analyzeUseCase.execute.mockRejectedValue(error);
    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);

    expect(technicalDesignUseCase.execute).not.toHaveBeenCalled();
    expect(taskBreakdownUseCase.execute).not.toHaveBeenCalled();
  });

  it("should propagate error if technical design fails", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    });

    const error = new Error("Technical design failed");
    technicalDesignUseCase.execute.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);

    expect(taskBreakdownUseCase.execute).not.toHaveBeenCalled();
  });

  it("should propagate error if task breakdown fails", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    analyzeUseCase.execute.mockResolvedValue({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      tasks: ["Implement fallback logic"]
    });

    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular provider-backed delivery architecture",
      components: ["OTP orchestrator", "Channel provider adapter"],
      risks: ["Delivery provider outage"],
      observability: ["Delivery success metric"],
      rolloutPlan: ["Enable for beta users"]
    });

    const error = new Error("Task breakdown failed");
    taskBreakdownUseCase.execute.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);
  });
});
