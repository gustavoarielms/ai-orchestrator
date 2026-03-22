import { BadRequestException } from "@nestjs/common";
import { PlanRequirementUseCase } from "./plan-requirement.use-case";
import { RefineUseCase } from "../../../refinement/application/use-cases/refine.use-case";
import { AnalyzeUseCase } from "../../../analyze/application/use-cases/analyze.use-case";

describe("PlanRequirementUseCase", () => {
  let useCase: PlanRequirementUseCase;
  let refineUseCase: jest.Mocked<RefineUseCase>;
  let analyzeUseCase: jest.Mocked<AnalyzeUseCase>;

  beforeEach(() => {
    refineUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<RefineUseCase>;

    analyzeUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<AnalyzeUseCase>;

    useCase = new PlanRequirementUseCase(refineUseCase, analyzeUseCase);
  });

  it("should throw BadRequestException when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException when text is not a string", async () => {
    await expect(
      useCase.execute({ text: 123 as any })
    ).rejects.toThrow(BadRequestException);
  });

  it("should call refine first and then analyze", async () => {
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

    await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refineUseCase.execute).toHaveBeenCalledTimes(1);
    expect(analyzeUseCase.execute).toHaveBeenCalledTimes(1);

    expect(refineUseCase.execute).toHaveBeenCalledWith({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refineUseCase.execute.mock.invocationCallOrder[0]).toBeLessThan(
      analyzeUseCase.execute.mock.invocationCallOrder[0]
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

  it("should return refinement and analysis", async () => {
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

    refineUseCase.execute.mockResolvedValue(refinement);
    analyzeUseCase.execute.mockResolvedValue(analysis);

    const result = await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual({
      refinement,
      analysis
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
  });

  it("should not call analyze if refine fails", async () => {
    refineUseCase.execute.mockRejectedValue(new Error("Refinement failed"));

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toThrow("Refinement failed");

    expect(analyzeUseCase.execute).not.toHaveBeenCalled();
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
  });
});