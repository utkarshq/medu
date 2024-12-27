import React from "react"
import { 
  Card,
  Button,
  Text,
  Accordion
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"
import { TemplateVariantManager } from "../template-variant-manager"
import { PlusIcon } from "@medusajs/icons"

export const VariantConfiguration = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Card.Header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Variant Options</h2>
            <Text className="text-ui-fg-subtle mt-1">
              Configure the options that will be available for variants
            </Text>
          </div>
          <Button
            variant="secondary"
            size="small"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </Card.Header>
        <Card.Content>
          <Accordion type="multiple">
            <TemplateVariantManager />
          </Accordion>
        </Card.Content>
      </Card>

      {/* Variant Fields Section */}
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Variant Fields</h2>
          <Text className="text-ui-fg-subtle mt-1">
            Configure additional fields for variants
          </Text>
        </Card.Header>
        <Card.Content>
          <TemplateFieldManager
            fieldArrayName="variant_config.variant_fields"
            title="Variant Fields"
          />
        </Card.Content>
      </Card>
    </div>
  )
} 