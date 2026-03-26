import { AiProviderResolver } from "./ai-provider-resolver";
import { AiRuntimeConfig } from "../ai-runtime-config.types";

describe("AiProviderResolver", () => {
  let resolver: AiProviderResolver;
  let aiRuntimeConfig: AiRuntimeConfig;

  beforeEach(() => {
    aiRuntimeConfig = {
      primaryProvider: "openai",
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

  it("should resolve claude when configured as the primary provider", () => {
    aiRuntimeConfig.primaryProvider = "claude";

    const result = resolver.resolvePrimary({
      openai: "openai-provider",
      claude: "claude-provider"
    });

    expect(result).toBe("claude-provider");
  });
});
