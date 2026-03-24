jest.mock("../../../config/app.config", () => ({
  appConfig: {
    aiProvider: "openai",
    fallback: {
      enabled: true,
      provider: "claude"
    }
  }
}));

import { appConfig } from "../../../config/app.config";
import { AiProviderResolver } from "./ai-provider-resolver";

describe("AiProviderResolver", () => {
  let resolver: AiProviderResolver;

  beforeEach(() => {
    resolver = new AiProviderResolver();
    appConfig.aiProvider = "openai";
    appConfig.fallback.enabled = true;
    appConfig.fallback.provider = "claude";
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
    appConfig.fallback.enabled = false;

    expect(resolver.shouldUseFallback()).toBe(false);
  });

  it("should return false when primary and fallback providers match", () => {
    appConfig.fallback.provider = "openai";

    expect(resolver.shouldUseFallback()).toBe(false);
  });
});
