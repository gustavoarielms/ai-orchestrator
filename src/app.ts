import { Controller, Get, Module } from "@nestjs/common";

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
  controllers: [HealthController]
})
export class AppModule {}