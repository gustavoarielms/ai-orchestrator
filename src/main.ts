import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";
import { appConfig } from "./config/app.config";import { RequestIdInterceptor } from "./shared/interceptors/request-id.interceptor";
import { Logger } from "./shared/logger/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalInterceptors(new RequestIdInterceptor());
  
  await app.listen(appConfig.port);

  Logger.log(`AI Orchestrator running on http://localhost:${appConfig.port}`);
}

bootstrap();