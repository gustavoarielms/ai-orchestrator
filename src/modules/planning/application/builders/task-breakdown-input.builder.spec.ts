import { TaskBreakdownInputBuilder } from "./task-breakdown-input.builder";

describe("TaskBreakdownInputBuilder", () => {
  it("builds task breakdown input from analysis and technical design", () => {
    const result = TaskBreakdownInputBuilder.fromAnalysisAndTechnicalDesign(
      {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: [
          "OTP is first attempted via WhatsApp",
          "If WhatsApp fails, SMS is used"
        ],
        tasks: ["Implement fallback logic", "Add provider observability"]
      },
      {
        architecture: "Modular provider-backed delivery architecture",
        components: ["OTP orchestrator", "Channel provider adapter"],
        risks: ["Delivery provider outage"],
        observability: ["Delivery success metric"],
        rolloutPlan: ["Enable for beta users"]
      }
    );

    expect(result).toEqual({
      analysis: {
        userStory:
          "As a user, I want OTP delivery via WhatsApp with SMS fallback",
        acceptanceCriteria: [
          "OTP is first attempted via WhatsApp",
          "If WhatsApp fails, SMS is used"
        ],
        tasks: ["Implement fallback logic", "Add provider observability"]
      },
      technicalDesign: {
        architecture: "Modular provider-backed delivery architecture",
        components: ["OTP orchestrator", "Channel provider adapter"],
        risks: ["Delivery provider outage"],
        observability: ["Delivery success metric"],
        rolloutPlan: ["Enable for beta users"]
      }
    });
  });
});
