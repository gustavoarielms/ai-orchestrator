import { Controller, Get, Module } from "@nestjs/common";
import { AnalyzeController } from "./modules/analyze/analyze.controller";
import { AnalyzeService } from "./modules/analyze/analyze.service";

@Controller()
class HealthController {
  @Get("/health")
  getHealth() {
    return {
      status: "ok",
      service: "ai-orchestrator"
    };
  }
}

@Module({
  controllers: [HealthController, AnalyzeController],
  providers: [AnalyzeService]
})
export class AppModule {}