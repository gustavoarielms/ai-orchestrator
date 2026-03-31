import { RefinementController } from "./refinement.controller";
import { RefineHandler } from "../application/ports/refine-handler";

describe("RefinementController", () => {
  let controller: RefinementController;
  let refineUseCase: jest.Mocked<RefineHandler>;

  beforeEach(() => {
    refineUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<RefineHandler>;

    controller = new RefinementController(refineUseCase);
  });

  it("should delegate to use case", async () => {
    refineUseCase.execute.mockResolvedValue({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory:
        "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });

    const result = await controller.refine({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(refineUseCase.execute).toHaveBeenCalledWith({
      text: "Necesito implementar OTP por WhatsApp fallback SMS"
    });

    expect(result).toEqual({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory:
        "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
      edgeCases: ["WhatsApp provider unavailable"]
    });
  });

  it("should pass body through without breaking before use case validation", async () => {
    refineUseCase.execute.mockRejectedValue(
      new Error("validation handled by use case")
    );

    await expect(controller.refine({} as any)).rejects.toThrow(
      "validation handled by use case"
    );

    expect(refineUseCase.execute).toHaveBeenCalledWith({} as any);
  });

  it("should pass undefined body through without breaking before use case validation", async () => {
    refineUseCase.execute.mockRejectedValue(
        new Error("validation handled by use case")
    );

    await expect(controller.refine(undefined as any)).rejects.toThrow(
        "validation handled by use case"
    );

    expect(refineUseCase.execute).toHaveBeenCalledWith(undefined);
    });
});
