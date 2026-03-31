import { Body, Controller, Inject, Post } from "@nestjs/common";
import { TechnicalDesignHandler } from "../application/ports/technical-design-handler";
import { TECHNICAL_DESIGN_HANDLER } from "../application/tokens/technical-design-handler.token";
import { TechnicalDesignRequest } from "../domain/technical-design.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/technical-design")
export class TechnicalDesignController {
  constructor(
    @Inject(TECHNICAL_DESIGN_HANDLER)
    private readonly technicalDesignUseCase: TechnicalDesignHandler
  ) {}

  @Post()
  async design(@Body() body: TechnicalDesignRequest) {
    Logger.log("Technical design request received", {
      input: body?.source
    });

    const result = await this.technicalDesignUseCase.execute(body);

    Logger.log("Technical design request completed");

    return result;
  }
}
