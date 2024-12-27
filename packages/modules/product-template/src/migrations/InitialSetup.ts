import { Migration } from "@mikro-orm/migrations"

export class InitialSetup extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE template (
        id varchar PRIMARY KEY,
        title varchar NOT NULL,
        description text,
        metadata jsonb,
        status varchar CHECK (status IN ('draft', 'published', 'deprecated')),
        is_overridable boolean DEFAULT false,
        version int DEFAULT 1,
        created_by varchar NOT NULL,
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW()
      );

      CREATE TABLE template_field (
        id varchar PRIMARY KEY,
        template_id varchar REFERENCES template(id) ON DELETE CASCADE,
        field_name varchar NOT NULL,
        field_type varchar CHECK (field_type IN ('static', 'dynamic', 'optional')),
        default_value text,
        validation_rules jsonb,
        sort_order int DEFAULT 0,
        is_required boolean DEFAULT false,
        metadata jsonb,
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW()
      );

      CREATE INDEX idx_template_status ON template(status) WHERE status != 'deprecated';
      CREATE INDEX idx_template_title ON template(title);
      CREATE INDEX idx_template_field_template ON template_field(template_id);
      CREATE INDEX idx_template_field_name ON template_field(field_name);
    `)
  }
} 