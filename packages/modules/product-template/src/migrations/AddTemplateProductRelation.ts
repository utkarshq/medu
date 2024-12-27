import { Migration } from "@mikro-orm/migrations"

export class AddTemplateProductRelation extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" add column "template_id" text references "template"(id);'
    )
    this.addSql(
      'alter table "product" add column "template_data" jsonb;'
    )
    this.addSql(
      'create index "IDX_product_template" on "product" ("template_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop column if exists "template_data";')
    this.addSql('alter table "product" drop column if exists "template_id";')
  }
} 