import { TechnicalDesignController } from "./technical-design.controller";
import { TechnicalDesignUseCase } from "../application/use-cases/technical-design.use-case";

describe("TechnicalDesignController", () => {
  let controller: TechnicalDesignController;
  let technicalDesignUseCase: jest.Mocked<TechnicalDesignUseCase>;

  beforeEach(() => {
    technicalDesignUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TechnicalDesignUseCase>;

    controller = new TechnicalDesignController(technicalDesignUseCase);
  });

  it("should delegate to use case", async () => {
    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    const result = await controller.design({
      text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
    });

    expect(technicalDesignUseCase.execute).toHaveBeenCalledWith({
      text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
    });
    expect(result.components).toContain("TechnicalDesignController");
  });

  it("should pass body through without breaking before use case validation", async () => {
    technicalDesignUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.design({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(technicalDesignUseCase.execute).toHaveBeenCalledWith({} as any);
  });

  it("should pass undefined body through without breaking before use case validation", async () => {
    technicalDesignUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.design(undefined as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(technicalDesignUseCase.execute).toHaveBeenCalledWith(undefined);
  });
});
