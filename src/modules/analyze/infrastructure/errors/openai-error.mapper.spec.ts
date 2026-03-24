import { BadRequestException } from "@nestjs/common";
import {
  extractErrorCode,
  mapOpenAiErrorToHttpException,
  shouldRetryOpenAiError
} from "./openai-error.mapper";

describe("openai-error.mapper", () => {
  it("should extract code from BadRequestException response", () => {
    const error = new BadRequestException({
      statusCode: 400,
      message: "Invalid JSON",
      code: "openai_invalid_json"
    });

    expect(extractErrorCode(error)).toBe("openai_invalid_json");
  });

  it("should extract code directly from provider error", () => {
    const error = {
      status: 429,
      code: "insufficient_quota"
    };

    expect(extractErrorCode(error)).toBe("insufficient_quota");
  });

  it("should return true for recoverable model output errors", () => {
    const error = new BadRequestException({
      statusCode: 400,
      message: "Invalid JSON",
      code: "openai_invalid_json"
    });

    expect(shouldRetryOpenAiError(error)).toBe(true);
  });

  it("should return false for non-retryable provider errors", () => {
    const error = {
      status: 429,
      code: "insufficient_quota"
    };

    expect(shouldRetryOpenAiError(error)).toBe(false);
  });

  it("should map timeout error to gateway timeout", () => {
    const error = {
      name: "APIConnectionTimeoutError",
      message: "Request timed out"
    };

    const mapped = mapOpenAiErrorToHttpException(error, "analyze_request") as any;

    expect(mapped.response.statusCode).toBe(504);
    expect(mapped.response.code).toBe("openai_timeout");
  });
});
