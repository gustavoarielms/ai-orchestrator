import { Body, Controller, Post } from "@nestjs/common";
import { TechnicalDesignUseCase } from "../application/use-cases/technical-design.use-case";
import { TechnicalDesignRequest } from "../domain/technical-design.types";
import { Logger } from "../../../shared/logger/logger";

@Controller("/technical-design")
export class TechnicalDesignController {
  constructor(
    private readonly technicalDesignUseCase: TechnicalDesignUseCase
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
