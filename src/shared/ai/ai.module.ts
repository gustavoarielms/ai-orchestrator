import { Global, Module } from "@nestjs/common";
import { AiProviderResolver } from "./providers/ai-provider-resolver";
import { OpenAiStructuredExecutor } from "./openai/openai-structured-executor";

@Global()
@Module({
  providers: [AiProviderResolver, OpenAiStructuredExecutor],
  exports: [AiProviderResolver, OpenAiStructuredExecutor]
})
export class AiModule {}
