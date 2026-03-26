import { TechnicalDesignInputBuilder } from "./technical-design-input.builder";

describe("TechnicalDesignInputBuilder", () => {
  it("builds technical design input from analysis output", () => {
    const result = TechnicalDesignInputBuilder.fromAnalysis({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      tasks: ["Implement fallback logic", "Add provider observability"]
    });

    expect(result).toEqual({
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      tasks: ["Implement fallback logic", "Add provider observability"]
    });
  });
});
