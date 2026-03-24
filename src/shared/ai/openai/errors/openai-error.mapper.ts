import {
  BadRequestException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common";

const RECOVERABLE_MODEL_OUTPUT_ERRORS = [
  "openai_empty_response",
  "openai_invalid_json",
  "openai_malformed_json",
  "openai_schema_validation_failed"
];

export function extractErrorCode(error: any): string | null {
  const errorResponse =
    error instanceof BadRequestException ? error.getResponse() : null;

  if (
    typeof errorResponse === "object" &&
    errorResponse !== null &&
    "code" in errorResponse &&
    typeof errorResponse.code === "string"
  ) {
    return errorResponse.code;
  }

  if (typeof error?.code === "string") {
    return error.code;
  }

  return null;
}

export function shouldRetryOpenAiError(error: any): boolean {
  const errorCode = extractErrorCode(error);

  return (
    error instanceof BadRequestException &&
    RECOVERABLE_MODEL_OUTPUT_ERRORS.includes(errorCode ?? "")
  );
}

export function mapOpenAiErrorToHttpException(
  error: any,
  operationName: string
): Error {
  if (error?.name === "APIConnectionTimeoutError") {
    return new GatewayTimeoutException({
      statusCode: HttpStatus.GATEWAY_TIMEOUT,
      message: "OpenAI request timed out.",
      code: "openai_timeout"
    });
  }

  if (error?.status === 429 && error?.code === "insufficient_quota") {
    return new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: "OpenAI quota exceeded. Check billing or API usage limits.",
        code: "openai_insufficient_quota"
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }

  if (error?.status === 429) {
    return new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: "OpenAI rate limit exceeded. Please try again later.",
        code: "openai_rate_limit_exceeded"
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }

  if (error?.status === 401) {
    return new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "OpenAI authentication failed. Check API key configuration.",
      code: "openai_authentication_failed"
    });
  }

  if (error instanceof BadRequestException) {
    return error;
  }

  return new InternalServerErrorException({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: `Failed to execute ${operationName}.`,
    code: `${operationName}_failed`
  });
}
