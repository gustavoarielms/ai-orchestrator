import { BadRequestException } from "@nestjs/common";
import { parseAnalyzeResponse } from "./parse-analyze-response";

describe("parseAnalyzeResponse", () => {
  it("should parse a valid JSON response", () => {
    const raw = JSON.stringify({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent", "OTP is validated"],
      tasks: ["Create endpoint", "Validate OTP"]
    });

    const result = parseAnalyzeResponse(raw);

    expect(result).toEqual({
      userStory: "As a user, I want OTP login",
      acceptanceCriteria: ["OTP is sent", "OTP is validated"],
      tasks: ["Create endpoint", "Validate OTP"]
    });
  });

  it("should parse JSON wrapped in extra text", () => {
    const raw = `
      Here is the response:
      {
        "userStory": "As a user, I want OTP login",
        "acceptanceCriteria": ["OTP is sent"],
        "tasks": ["Create endpoint"]
      }
    `;

    const result = parseAnalyzeResponse(raw);

    expect(result.userStory).toBe("As a user, I want OTP login");
    expect(result.acceptanceCriteria).toEqual(["OTP is sent"]);
    expect(result.tasks).toEqual(["Create endpoint"]);
  });

  it("should throw when response is empty", () => {
    expect(() => parseAnalyzeResponse("")).toThrow(BadRequestException);
  });

  it("should throw when JSON is malformed", () => {
    const raw = `{"userStory":"x","acceptanceCriteria":["a"],"tasks":[}`;
    expect(() => parseAnalyzeResponse(raw)).toThrow(BadRequestException);
  });

  it("should throw when schema is invalid", () => {
    const raw = JSON.stringify({
      userStory: "",
      acceptanceCriteria: [],
      tasks: ["Create endpoint"]
    });

    expect(() => parseAnalyzeResponse(raw)).toThrow(BadRequestException);
  });
});