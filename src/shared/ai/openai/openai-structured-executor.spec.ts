import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";
import { z } from "zod";
import { OpenAiStructuredExecutor } from "./openai-structured-executor";
import { MetricsRecorder } from "../../metrics/ports/metrics-recorder";

jest.mock("../../../config/app.config", () => ({
  appConfig: {
    port: 3000,
    nodeEnv: "test",
    openai: {
      apiKey: "test-api-key",
      model: "gpt-5.4",
      timeoutMs: 10000,
      maxAttempts: 2
    }
  }
}));

jest.mock("../../openai/openai.client", () => ({
  openai: {
    responses: {
      create: jest.fn()
    }
  }
}));

import { openai } from "../../openai/openai.client";

describe("OpenAiStructuredExecutor", () => {
  let executor: OpenAiStructuredExecutor;
  let metricsRecorder: jest.Mocked<MetricsRecorder>;

  const schema = z
    .object({
      value: z.string().min(1)
    })
    .strict();

  beforeEach(() => {
    jest.clearAllMocks();
    metricsRecorder = {
      incrementRequest: jest.fn(),
      incrementError: jest.fn(),
      incrementRetry: jest.fn(),
      incrementFallback: jest.fn(),
      recordLatency: jest.fn(),
      getMetrics: jest.fn()
    };
    executor = new OpenAiStructuredExecutor(metricsRecorder);
  });

  it("returns parsed and validated response when output is valid", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: JSON.stringify({
        value: "ok"
      })
    });

    const result = await executor.execute({
      operationName: "test_operation",
      prompt: [
        { role: "system", content: "system prompt" },
        { role: "user", content: "user prompt" }
      ],
      schema
    });

    expect(result).toEqual({
      value: "ok"
    });

    expect(openai.responses.create).toHaveBeenCalledTimes(1);
  });

  it("throws openai_empty_response when model returns empty output", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: ""
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        code: "openai_empty_response"
      }
    });
  });

  it("throws openai_invalid_json when model returns no JSON object", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: "plain text response"
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        code: "openai_invalid_json"
      }
    });
  });

  it("throws openai_malformed_json when model returns malformed JSON", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: '{"value": }'
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        code: "openai_malformed_json"
      }
    });
  });

  it("throws openai_schema_validation_failed when response does not match schema", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: JSON.stringify({
        wrongField: "oops"
      })
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 400,
        code: "openai_schema_validation_failed"
      }
    });
  });

  it("retries recoverable model output errors once", async () => {
    (openai.responses.create as jest.Mock)
      .mockResolvedValueOnce({
        output_text: '{"value": }'
      })
      .mockResolvedValueOnce({
        output_text: JSON.stringify({
          value: "ok"
        })
      });

    const result = await executor.execute({
      operationName: "test_operation",
      prompt: [
        { role: "system", content: "system prompt" },
        { role: "user", content: "user prompt" }
      ],
      schema
    });

    expect(result).toEqual({ value: "ok" });
    expect(openai.responses.create).toHaveBeenCalledTimes(2);
    expect(metricsRecorder.incrementRetry).toHaveBeenCalledTimes(1);
  });

  it("maps 429 insufficient_quota to HttpException", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue({
      status: 429,
      code: "insufficient_quota"
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 429,
        code: "openai_insufficient_quota"
      }
    });
  });

  it("maps generic 429 to HttpException", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue({
      status: 429,
      code: "rate_limit_exceeded"
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 429,
        code: "openai_rate_limit_exceeded"
      }
    });
  });

  it("maps 401 to UnauthorizedException", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue({
      status: 401
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("preserves BadRequestException", async () => {
    const badRequest = new BadRequestException({
      statusCode: 400,
      message: "custom bad request",
      code: "custom_bad_request"
    });

    (openai.responses.create as jest.Mock).mockRejectedValue(badRequest);

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toBe(badRequest);
  });

  it("maps timeout errors to gateway timeout", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue({
      name: "APIConnectionTimeoutError",
      message: "Request timed out"
    });

    await expect(
      executor.execute({
        operationName: "test_operation",
        prompt: [
          { role: "system", content: "system prompt" },
          { role: "user", content: "user prompt" }
        ],
        schema
      })
    ).rejects.toMatchObject({
      response: {
        statusCode: 504,
        code: "openai_timeout"
      }
    });
  });

  it("maps unknown errors to InternalServerErrorException", async () => {
    (openai.responses.create as jest.Mock).mockRejectedValue(
      new Error("unexpected failure")
    );

    const executionPromise = executor.execute({
      operationName: "test_operation",
      prompt: [
        { role: "system", content: "system prompt" },
        { role: "user", content: "user prompt" }
      ],
      schema
    });

    await expect(executionPromise).rejects.toBeInstanceOf(
      InternalServerErrorException
    );

    await expect(executionPromise).rejects.toMatchObject({
      response: {
        statusCode: 500,
        code: "test_operation_failed"
      }
    });
  });
});
