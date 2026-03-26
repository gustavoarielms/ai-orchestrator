import { AnalysisInputBuilder } from "./analysis-input.builder";

describe("AnalysisInputBuilder", () => {
  it("builds analysis input from refinement output", () => {
    const result = AnalysisInputBuilder.fromRefinement({
      problem: "Users need a backup channel for OTP delivery",
      goal: "Ensure OTP is delivered even if WhatsApp fails",
      userStory: "As a user, I want OTP delivery via WhatsApp with SMS fallback",
      acceptanceCriteria: [
        "OTP is first attempted via WhatsApp",
        "If WhatsApp fails, SMS is used"
      ],
      edgeCases: [
        "WhatsApp provider unavailable",
        "SMS provider unavailable"
      ]
    });

    expect(result).toBe(
      [
        "Problem: Users need a backup channel for OTP delivery",
        "Goal: Ensure OTP is delivered even if WhatsApp fails",
        "User Story: As a user, I want OTP delivery via WhatsApp with SMS fallback",
        "Acceptance Criteria: OTP is first attempted via WhatsApp; If WhatsApp fails, SMS is used",
        "Edge Cases: WhatsApp provider unavailable; SMS provider unavailable"
      ].join("\n")
    );
  });
});
