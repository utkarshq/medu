import { EventBusService } from "@medusajs/framework/utils"
import TemplateCacheService from "../services/template-cache-service"
import { Logger } from "@medusajs/framework/types"

export default class TemplateSubscriber {
  protected readonly cacheService_: TemplateCacheService
  protected readonly logger_: Logger

  constructor({ 
    eventBusService,
    templateCacheService,
    logger
  }: { 
    eventBusService: EventBusService
    templateCacheService: TemplateCacheService
    logger: Logger
  }) {
    this.cacheService_ = templateCacheService
    this.logger_ = logger

    // Subscribe to events
    eventBusService.subscribe("template.created", this.handleTemplateCreated)
    eventBusService.subscribe("template.updated", this.handleTemplateUpdated)
    eventBusService.subscribe("template.versioned", this.handleTemplateVersioned)
    eventBusService.subscribe("product.created", this.handleProductCreated)
  }

  handleTemplateCreated = async (data: Record<string, any>) => {
    this.logger_.info(`New template created: ${data.id}`)
  }

  handleTemplateUpdated = async (data: Record<string, any>) => {
    await this.cacheService_.invalidateTemplate(data.id)
    this.logger_.info(`Template updated: ${data.id}`)
  }

  handleTemplateVersioned = async (data: Record<string, any>) => {
    this.logger_.info(
      `Template versioned: ${data.id} (${data.previousVersion} -> ${data.newVersion})`
    )
  }

  handleProductCreated = async (data: Record<string, any>) => {
    if (data.template_id) {
      this.logger_.info(
        `New product created using template: ${data.template_id}`
      )
    }
  }
} 