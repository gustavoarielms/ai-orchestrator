import { z } from "zod";

export const TaskBreakdownResponseSchema = z
  .object({
    tasks: z.array(z.string().min(1)).min(1),
    technicalApproach: z.string().min(1),
    tests: z.array(z.string().min(1)).min(1),
    definitionOfDone: z.array(z.string().min(1)).min(1)
  })
  .strict();

export type TaskBreakdownResponseSchemaType = z.infer<
  typeof TaskBreakdownResponseSchema
>;
