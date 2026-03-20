import { Module } from "@nestjs/common";
import { AnalyzeModule } from "./modules/analyze/analyze.module";
import { SystemModule } from "./modules/system/system.module";

@Module({
  imports: [AnalyzeModule, SystemModule]
})
export class AppModule {}