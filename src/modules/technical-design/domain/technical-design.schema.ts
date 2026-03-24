import { z } from "zod";

export const TechnicalDesignResponseSchema = z
  .object({
    architecture: z.string().min(1),
    components: z.array(z.string().min(1)).min(1),
    risks: z.array(z.string().min(1)).min(1),
    observability: z.array(z.string().min(1)).min(1),
    rolloutPlan: z.array(z.string().min(1)).min(1)
  })
  .strict();

export type TechnicalDesignResponseSchemaType = z.infer<
  typeof TechnicalDesignResponseSchema
>;
