import { z } from "zod"

// Enhanced validation rule types
export const ValidationRuleDTO = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("regex"),
    value: z.string(),
    message: z.string(),
    flags: z.string().optional() // for regex flags like 'i', 'g'
  }),
  z.object({
    type: z.literal("min"),
    value: z.number(),
    message: z.string(),
    inclusive: z.boolean().default(true)
  }),
  z.object({
    type: z.literal("max"),
    value: z.number(),
    message: z.string(),
    inclusive: z.boolean().default(true)
  }),
  z.object({
    type: z.literal("enum"),
    value: z.array(z.string()),
    message: z.string(),
    case_sensitive: z.boolean().default(false)
  }),
  z.object({
    type: z.literal("custom"),
    value: z.string(), // JavaScript validation function as string
    message: z.string(),
    params: z.record(z.any()).optional()
  })
])

export const CreateTemplateFieldDTO = z.object({
  field_name: z.string()
    .min(1, "Field name is required")
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Field name must start with a letter and contain only letters, numbers, and underscores"),
  field_type: z.enum(["static", "dynamic", "optional"]),
  default_value: z.string().optional(),
  is_required: z.boolean().default(false),
  validation_rules: z.array(ValidationRuleDTO).optional(),
  metadata: z.record(z.any()).optional(),
  sort_order: z.number().int().min(0).optional(),
  group: z.string().optional(),
  help_text: z.string().optional(),
  placeholder: z.string().optional(),
  hidden: z.boolean().default(false)
})

export const CreateTemplateDTO = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "deprecated"]).default("draft"),
  is_overridable: z.boolean().default(false),
  fields: z.array(CreateTemplateFieldDTO).optional(),
  metadata: z.record(z.any()).optional(),
  version: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail_url: z.string().url().optional()
})

export type ValidationRuleDTO = z.infer<typeof ValidationRuleDTO>
export type CreateTemplateFieldDTO = z.infer<typeof CreateTemplateFieldDTO>
export type CreateTemplateDTO = z.infer<typeof CreateTemplateDTO> 