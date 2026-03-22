import { z } from "zod";

export const RefineResponseSchema = z
  .object({
    problem: z.string().min(1),
    goal: z.string().min(1),
    userStory: z.string().min(1),
    acceptanceCriteria: z.array(z.string().min(1)).min(1),
    edgeCases: z.array(z.string().min(1)).min(1)
  })
  .strict();

export type RefineResponseSchemaType = z.infer<typeof RefineResponseSchema>;