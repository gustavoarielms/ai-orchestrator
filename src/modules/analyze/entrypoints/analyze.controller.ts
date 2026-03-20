import { Body, Controller, Post, Req } from "@nestjs/common";
import { AnalyzeUseCase } from "../application/use-cases/analyze.use-case";
import { AnalyzeRequest } from "../domain/analyze.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/analyze")
export class AnalyzeController {
  constructor(private readonly analyzeUseCase: AnalyzeUseCase) {}

  @Post()
  async analyze(@Body() body: AnalyzeRequest, @Req() req: any) {
    Logger.log("Analyze request received", {
      requestId: req.requestId,
      input: body.text
    });

    const result = await this.analyzeUseCase.execute(body);

    Logger.log("Analyze request completed", {
      requestId: req.requestId
    });

    return result;
  }
}