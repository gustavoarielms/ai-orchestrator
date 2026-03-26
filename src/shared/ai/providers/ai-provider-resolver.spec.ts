import { AiProviderResolver } from "./ai-provider-resolver";
import { AiRuntimeConfig } from "../ai-runtime-config.types";

describe("AiProviderResolver", () => {
  let resolver: AiProviderResolver;
  let aiRuntimeConfig: AiRuntimeConfig;

  beforeEach(() => {
    aiRuntimeConfig = {
      primaryProvider: "openai",
      fallbackEnabled: true,
      fallbackProvider: "claude",
      openai: {
        apiKey: "test-api-key",
        model: "gpt-5.4",
        timeoutMs: 10000,
        maxAttempts: 2
      }
    };
    resolver = new AiProviderResolver(aiRuntimeConfig);
  });

  it("should resolve primary provider from configured AI provider", () => {
    const result = resolver.resolvePrimary({
      openai: "openai-provider",
      claude: "claude-provider"
    });

    expect(result).toBe("openai-provider");
  });

  it("should resolve fallback provider from configured fallback provider", () => {
    const result = resolver.resolveFallback({
      openai: "openai-provider",
      claude: "claude-provider"
    });

    expect(result).toBe("claude-provider");
  });

  it("should return true when fallback should be used", () => {
    expect(resolver.shouldUseFallback()).toBe(true);
  });

  it("should return false when fallback is disabled", () => {
    aiRuntimeConfig.fallbackEnabled = false;

    expect(resolver.shouldUseFallback()).toBe(false);
  });

  it("should return false when primary and fallback providers match", () => {
    aiRuntimeConfig.fallbackProvider = "openai";

    expect(resolver.shouldUseFallback()).toBe(false);
  });
});
