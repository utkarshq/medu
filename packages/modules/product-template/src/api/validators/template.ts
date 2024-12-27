import { IsString, IsEnum, IsOptional, IsObject, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { TemplateStatus } from "../../types"

export class CreateTemplateDTO {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(TemplateStatus)
  status: TemplateStatus

  @IsObject()
  @ValidateNested()
  @Type(() => TemplateFieldConfig)
  base_fields: TemplateFieldConfig[]

  @IsObject()
  @ValidateNested()
  @Type(() => VariantConfig)
  variant_config: VariantConfig
}

export const validateTemplateCreate = (req, res, next) => {
  const validated = validateDTO(CreateTemplateDTO, req.body)
  req.body = validated
  next()
}

export class UpdateTemplateDTO {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(TemplateStatus)
  @IsOptional()
  status?: TemplateStatus

  @IsObject()
  @ValidateNested()
  @Type(() => TemplateFieldConfig)
  @IsOptional()
  base_fields?: TemplateFieldConfig[]

  @IsObject()
  @ValidateNested()
  @Type(() => VariantConfig)
  @IsOptional()
  variant_config?: VariantConfig
}

export const validateTemplateUpdate = (req, res, next) => {
  const validated = validateDTO(UpdateTemplateDTO, req.body)
  req.body = validated
  next()
} 