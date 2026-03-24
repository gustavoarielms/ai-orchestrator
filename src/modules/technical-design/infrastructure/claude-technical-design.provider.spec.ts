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
        text: "Design a technical solution for OTP with WhatsApp and SMS fallback"
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
