import { Migration } from "@mikro-orm/migrations"

export class InitialSetup extends Migration {
  async up(): Promise<void> {
    // Template table
    this.addSql(`
      CREATE TABLE "template" (
        "id" varchar PRIMARY KEY,
        "title" varchar NOT NULL,
        "description" text,
        "status" varchar NOT NULL,
        "version" integer DEFAULT 1,
        "base_fields" jsonb NOT NULL,
        "variant_config" jsonb NOT NULL,
        "settings" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        "deleted_at" timestamp
      );
    `)

    // Template fields table
    this.addSql(`
      CREATE TABLE "template_field" (
        "id" varchar PRIMARY KEY,
        "template_id" varchar REFERENCES "template"(id),
        "field_name" varchar NOT NULL,
        "field_type" varchar NOT NULL,
        "value_type" varchar NOT NULL,
        "default_value" jsonb,
        "settings" jsonb,
        "sort_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        "deleted_at" timestamp
      );
    `)

    // Indexes
    this.addSql(`
      CREATE INDEX "IDX_template_status" ON "template" ("status") 
      WHERE deleted_at IS NULL;
    `)
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "template_field";')
    this.addSql('DROP TABLE IF EXISTS "template";')
  }
} 