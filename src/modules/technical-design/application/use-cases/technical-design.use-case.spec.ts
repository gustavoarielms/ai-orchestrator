import { BadRequestException } from "@nestjs/common";
import { TechnicalDesignUseCase } from "./technical-design.use-case";
import { TechnicalDesignProvider } from "../ports/technical-design.provider";

describe("TechnicalDesignUseCase", () => {
  let useCase: TechnicalDesignUseCase;
  let technicalDesignProvider: jest.Mocked<TechnicalDesignProvider>;

  beforeEach(() => {
    technicalDesignProvider = {
      design: jest.fn()
    };

    useCase = new TechnicalDesignUseCase(technicalDesignProvider);
  });

  it("should delegate to provider with valid input", async () => {
    technicalDesignProvider.design.mockResolvedValue({
      architecture: "Modular NestJS service with provider-backed AI execution",
      components: ["TechnicalDesignController", "TechnicalDesignUseCase"],
      risks: ["Claude provider remains a placeholder"],
      observability: ["Structured logs", "Metrics for retries/fallback"],
      rolloutPlan: ["Ship behind internal endpoint", "Validate output quality"]
    });

    const result = await useCase.execute({
      text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
    });

    expect(technicalDesignProvider.design).toHaveBeenCalledWith({
      text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
    });
    expect(result.architecture).toContain("Modular NestJS");
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
    technicalDesignProvider.design.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
      })
    ).rejects.toBe(error);
  });
});
