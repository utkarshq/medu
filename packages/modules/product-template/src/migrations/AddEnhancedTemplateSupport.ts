export class AddEnhancedTemplateSupport extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "template" 
      ADD COLUMN "variant_config" jsonb NOT NULL DEFAULT '{"options":[],"variant_fields":[]}',
      ADD COLUMN "product_fields" jsonb NOT NULL DEFAULT '[]',
      ADD COLUMN "settings" jsonb,
      ADD COLUMN "parent_template_id" text REFERENCES "template"(id)
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE "template" 
      DROP COLUMN "variant_config",
      DROP COLUMN "product_fields",
      DROP COLUMN "settings",
      DROP COLUMN "parent_template_id"
    `)
  }
} 