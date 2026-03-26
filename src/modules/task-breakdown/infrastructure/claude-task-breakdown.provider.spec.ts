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
        source: {
          analysis: {
            userStory:
              "As a user, I want OTP delivery via WhatsApp with SMS fallback",
            acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
            tasks: ["Implement fallback logic"]
          },
          technicalDesign: {
            architecture: "Modular provider-backed delivery architecture",
            components: ["OTP orchestrator", "Channel provider adapter"],
            risks: ["Delivery provider outage"],
            observability: ["Delivery success metric"],
            rolloutPlan: ["Enable for beta users"]
          }
        }
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
