import { NotImplementedException } from "@nestjs/common";
import { ClaudeTaskBreakdownProvider } from "./claude-task-breakdown.provider";

describe("ClaudeTaskBreakdownProvider", () => {
  let provider: ClaudeTaskBreakdownProvider;

  beforeEach(() => {
    provider = new ClaudeTaskBreakdownProvider();
  });

  it("should throw NotImplementedException", async () => {
    await expect(
      provider.breakdown({
        text: "Create executable team work from the technical design"
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
