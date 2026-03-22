import { BadRequestException } from "@nestjs/common";
import { RefineUseCase } from "./refine.use-case";
import { RefinementProvider } from "../ports/refinement.provider";

describe("RefineUseCase", () => {
  let useCase: RefineUseCase;
  let refinementProvider: jest.Mocked<RefinementProvider>;

  beforeEach(() => {
    refinementProvider = {
      refine: jest.fn()
    };

    useCase = new RefineUseCase(refinementProvider);
  });

  it("should delegate to provider with valid input", async () => {
    refinementProvider.refine.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    const result = await useCase.execute({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refinementProvider.refine).toHaveBeenCalledWith({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });
  });

  it("should throw BadRequestException when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException when text is not a string", async () => {
    await expect(
      useCase.execute({ text: 123 as any })
    ).rejects.toThrow(BadRequestException);
  });

  it("should propagate provider errors", async () => {
    const error = new Error("Refinement provider failed");
    refinementProvider.refine.mockRejectedValue(error);

    await expect(
      useCase.execute({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBe(error);
  });
});