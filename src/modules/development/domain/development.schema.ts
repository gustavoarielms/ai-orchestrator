import { z } from "zod";

export const DevelopmentResponseSchema = z
  .object({
    filesToChange: z.array(z.string().min(1)).min(1),
    codeChanges: z
      .array(
        z
          .object({
            file: z.string().min(1),
            changeType: z.enum(["create", "update"]),
            summary: z.string().min(1),
            content: z.string().min(1)
          })
          .strict()
      )
      .min(1),
    testsToAdd: z
      .array(
        z
          .object({
            file: z.string().min(1),
            summary: z.string().min(1),
            content: z.string().min(1)
          })
          .strict()
      )
      .min(1),
    notes: z.array(z.string().min(1)).min(1)
  })
  .strict();

export type DevelopmentResponseSchemaType = z.infer<
  typeof DevelopmentResponseSchema
>;
