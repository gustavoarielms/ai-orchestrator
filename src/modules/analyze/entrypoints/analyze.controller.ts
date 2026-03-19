import { Body, Controller, Post } from "@nestjs/common";
import { AnalyzeUseCase } from "../application/use-cases/analyze.use-case";
import { AnalyzeRequest } from "../domain/analyze.types";

@Controller("/analyze")
export class AnalyzeController {
  constructor(private readonly analyzeUseCase: AnalyzeUseCase) {}

  @Post()
  async analyze(@Body() body: AnalyzeRequest) {
    return await this.analyzeUseCase.execute(body);
  }
}