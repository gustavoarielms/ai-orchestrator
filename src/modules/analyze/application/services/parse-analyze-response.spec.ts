import { BadRequestException } from "@nestjs/common";
import { AnalyzeUseCase } from "../use-cases/analyze.use-case";
import { AnalysisProvider } from "../ports/analysis.provider";

describe("AnalyzeUseCase", () => {
  let useCase: AnalyzeUseCase;
  let provider: jest.Mocked<AnalysisProvider>;

  beforeEach(() => {
    provider = {
      analyze: jest.fn()
    };

    useCase = new AnalyzeUseCase(provider);
  });

  it("should delegate to provider when input is valid", async () => {
    provider.analyze.mockResolvedValue({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });

    const result = await useCase.execute({
      text: "implement OTP login"
    });

    expect(provider.analyze).toHaveBeenCalledWith({
      text: "implement OTP login"
    });

    expect(result).toEqual({
      userStory: "As a user...",
      acceptanceCriteria: ["Criterion 1"],
      tasks: ["Task 1"]
    });
  });

  it("should throw when text is missing", async () => {
    await expect(useCase.execute({} as any)).rejects.toThrow(BadRequestException);
  });

  it("should throw when text is not a string", async () => {
    await expect(useCase.execute({ text: 123 as any })).rejects.toThrow(BadRequestException);
  });
});