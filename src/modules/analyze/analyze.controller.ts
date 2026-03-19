import { Body, Controller, Post, BadRequestException } from "@nestjs/common";
import { AnalyzeService } from "./analyze.service";
import { AnalyzeRequestDto } from "./dto";

@Controller("/analyze")
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  analyze(@Body() body: AnalyzeRequestDto) {
    if (!body?.text || typeof body.text !== "string") {
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    return this.analyzeService.analyze(body);
  }
}