import { Injectable } from "@nestjs/common";
import { AnalyzeRequestDto, AnalyzeResponseDto } from "./dto";

@Injectable()
export class AnalyzeService {
  analyze(input: AnalyzeRequestDto): AnalyzeResponseDto {
    return {
      userStory: `As a user, I want ${input.text}`,
      acceptanceCriteria: [
        "The system should handle the request correctly",
        "The flow should be validated",
        "Errors should be handled properly"
      ],
      tasks: [
        "Define API contract",
        "Implement service logic",
        "Add validation layer"
      ]
    };
  }
}