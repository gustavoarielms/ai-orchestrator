import { NotImplementedException } from "@nestjs/common";
import { ClaudeTechnicalDesignProvider } from "./claude-technical-design.provider";

describe("ClaudeTechnicalDesignProvider", () => {
  let provider: ClaudeTechnicalDesignProvider;

  beforeEach(() => {
    provider = new ClaudeTechnicalDesignProvider();
  });

  it("should throw NotImplementedException", async () => {
    await expect(
      provider.design({
        source: {
          userStory:
            "As a user, I want OTP delivery via WhatsApp with SMS fallback",
          acceptanceCriteria: ["OTP is first attempted via WhatsApp"],
          tasks: ["Implement fallback logic"]
        }
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
