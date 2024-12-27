import { z } from "zod"

export const templateFieldSchema = z.object({
  field_name: z.string().min(1, "Field name is required"),
  field_type: z.enum(["static", "dynamic", "optional"]),
  default_value: z.string().optional(),
  is_required: z.boolean().default(false),
  validation_rules: z.array(z.object({
    type: z.enum(["regex", "min", "max", "enum", "custom"]),
    value: z.any(),
    message: z.string()
  })).optional(),
  metadata: z.record(z.any()).optional()
})

export const templateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "deprecated"]).default("draft"),
  is_overridable: z.boolean().default(false),
  fields: z.array(templateFieldSchema),
  metadata: z.record(z.any()).optional()
}) 