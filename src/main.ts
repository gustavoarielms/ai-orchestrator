import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";
import { appConfig } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(appConfig.port);

  console.log(`AI Orchestrator running on http://localhost:${appConfig.port}`);
}

bootstrap();