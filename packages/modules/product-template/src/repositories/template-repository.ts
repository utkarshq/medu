import { Repository } from "@medusajs/framework/utils"
import { Template } from "../models"
import { MikroORM } from "@mikro-orm/core"

export class TemplateRepository extends Repository<Template> {
  constructor(private readonly orm: MikroORM) {
    super(...arguments)
  }

  async findWithActiveVersion(id: string) {
    return this.findOne({
      id,
      status: { $ne: "deprecated" }
    })
  }

  async findWithFields(id: string) {
    return this.findOne({
      id,
      relations: ["fields"]
    })
  }

  async findTemplatesInUse() {
    const qb = this.orm.em.createQueryBuilder(Template)
    return qb
      .select(["t.id", "t.title", "COUNT(p.id) as usage_count"])
      .leftJoin("product", "p", "p.template_id = t.id")
      .where({ status: { $ne: "deprecated" } })
      .groupBy("t.id")
      .having("COUNT(p.id) > 0")
      .execute()
  }
} 