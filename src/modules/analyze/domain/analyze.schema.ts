import { z } from "zod";

export const AnalyzeResponseSchema = z
  .object({
    userStory: z.string().min(1),
    acceptanceCriteria: z.array(z.string().min(1)).min(1),
    tasks: z.array(z.string().min(1)).min(1)
  })
  .strict();

export type AnalyzeResponseSchemaType = z.infer<typeof AnalyzeResponseSchema>;