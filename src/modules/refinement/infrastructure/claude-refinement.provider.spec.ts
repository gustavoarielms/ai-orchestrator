import { NotImplementedException } from "@nestjs/common";
import { ClaudeRefinementProvider } from "./claude-refinement.provider";

describe("ClaudeRefinementProvider", () => {
  let provider: ClaudeRefinementProvider;

  beforeEach(() => {
    provider = new ClaudeRefinementProvider();
  });

  it("should throw not implemented exception", async () => {
    await expect(
      provider.refine({
        text: "Necesito implementar OTP por WhatsApp fallback SMS"
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});