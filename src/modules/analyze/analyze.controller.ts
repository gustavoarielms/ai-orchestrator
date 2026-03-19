import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AnalyzeService } from "./analyze.service";
import { AnalyzeRequestDto } from "./dto";

@Controller("/analyze")
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  async analyze(@Body() body: AnalyzeRequestDto) {
    if (!body?.text || typeof body.text !== "string") {
      throw new BadRequestException("Invalid input: 'text' is required");
    }

    return await this.analyzeService.analyze(body);
  }
}