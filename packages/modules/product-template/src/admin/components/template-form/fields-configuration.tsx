import React from "react"
import { 
  Card,
  Button,
  Text
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"
import { TemplateFieldManager } from "../template-field-manager"
import { PlusIcon } from "@medusajs/icons"

export const FieldsConfiguration = () => {
  const { watch } = useFormContext()
  const fields = watch("base_fields") || []

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Card.Header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Product Fields</h2>
            <Text className="text-ui-fg-subtle mt-1">
              Configure the fields that will be used to create products
            </Text>
          </div>
          <Button
            variant="secondary"
            size="small"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </Card.Header>
        <Card.Content>
          <TemplateFieldManager />
        </Card.Content>
      </Card>
    </div>
  )
} 