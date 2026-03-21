import { ClaudeAnalysisProvider } from "./claude-analysis.provider";
import { NotImplementedException } from "@nestjs/common";

describe("ClaudeAnalysisProvider", () => {
  let provider: ClaudeAnalysisProvider;

  beforeEach(() => {
    provider = new ClaudeAnalysisProvider();
  });

  it("should throw not implemented exception", async () => {
    await expect(
      provider.analyze({ text: "implement OTP login" })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});