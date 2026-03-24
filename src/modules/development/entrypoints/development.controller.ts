import { Body, Controller, Post } from "@nestjs/common";
import { DevelopmentUseCase } from "../application/use-cases/development.use-case";
import { DevelopmentRequest } from "../domain/development.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/development")
export class DevelopmentController {
  constructor(private readonly developmentUseCase: DevelopmentUseCase) {}

  @Post()
  async develop(@Body() body: DevelopmentRequest) {
    Logger.log("Development request received");

    const result = await this.developmentUseCase.execute(body);

    Logger.log("Development request completed");

    return result;
  }
}
