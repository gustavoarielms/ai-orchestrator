import { Body, Controller, Inject, Post } from "@nestjs/common";
import { DevelopmentHandler } from "../application/ports/development-handler";
import { DEVELOPMENT_HANDLER } from "../application/tokens/development-handler.token";
import { DevelopmentRequest } from "../domain/development.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/development")
export class DevelopmentController {
  constructor(
    @Inject(DEVELOPMENT_HANDLER)
    private readonly developmentUseCase: DevelopmentHandler
  ) {}

  @Post()
  async develop(@Body() body: DevelopmentRequest) {
    Logger.log("Development request received");

    const result = await this.developmentUseCase.execute(body);

    Logger.log("Development request completed");

    return result;
  }
}
