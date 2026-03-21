import { Controller, Get } from "@nestjs/common";
import { HealthService } from "../services/health.service";

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("/health")
  getHealth() {
    return this.healthService.getBasicHealth();
  }

  @Get("/health/details")
  getHealthDetails() {
    return this.healthService.getDetailedHealth();
  }
}