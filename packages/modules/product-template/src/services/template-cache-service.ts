import { 
  MedusaService,
  InjectManager,
  MedusaContext 
} from "@medusajs/framework/utils"
import { Template } from "../models"
import { CacheService } from "@medusajs/framework/types"

class TemplateCacheService extends MedusaService({
  Template,
}) {
  protected readonly cacheService_: CacheService
  protected readonly TTL = 30 * 60 // 30 minutes

  constructor({ cacheService }) {
    super(...arguments)
    this.cacheService_ = cacheService
  }

  @InjectManager()
  async getCachedTemplate(
    id: string,
    @MedusaContext() context = {}
  ) {
    const cacheKey = `template:${id}`
    
    let template = await this.cacheService_.get<Template>(cacheKey)
    if (!template) {
      template = await this.templateService_.findOne({
        id,
        relations: ["fields"]
      }, context)

      if (template) {
        await this.cacheService_.set(cacheKey, template, this.TTL)
      }
    }

    return template
  }

  async invalidateTemplate(id: string): Promise<void> {
    await this.cacheService_.delete(`template:${id}`)
  }
}

export default TemplateCacheService 