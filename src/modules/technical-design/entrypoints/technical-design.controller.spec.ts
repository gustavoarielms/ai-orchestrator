import { TechnicalDesignController } from "./technical-design.controller";
import { TechnicalDesignHandler } from "../application/ports/technical-design-handler";

describe("TechnicalDesignController", () => {
  let controller: TechnicalDesignController;
  let technicalDesignUseCase: jest.Mocked<TechnicalDesignHandler>;

  beforeEach(() => {
    technicalDesignUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<TechnicalDesignHandler>;

    controller = new TechnicalDesignController(technicalDesignUseCase);
  });

  it("should delegate to use case", async () => {
    technicalDesignUseCase.execute.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["External provider instability"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    const result = await controller.design({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
    });

    expect(technicalDesignUseCase.execute).toHaveBeenCalledWith({
      source: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
        tasks: ["Implement fallback logic"]
      }
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
