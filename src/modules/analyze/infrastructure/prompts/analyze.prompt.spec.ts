import { buildAnalyzePrompt } from "./analyze.prompt";

describe("buildAnalyzePrompt", () => {
  it("should build the expected prompt structure", () => {
    const result = buildAnalyzePrompt({
      text: "implement OTP login"
    });

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      role: "system",
      content: expect.stringContaining(
        "You are an analysis agent for product and engineering workflows"
      )
    });

    expect(result[1]).toEqual({
      role: "user",
      content: "Analyze this requirement and return the structured output: implement OTP login"
    });
  });
});