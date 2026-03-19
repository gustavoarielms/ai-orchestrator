import { Controller, Get, Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";

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
  imports: [AnalyzeModule],
  controllers: [HealthController]
})
export class AppModule {}