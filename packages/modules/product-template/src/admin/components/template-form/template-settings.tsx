import React from "react"
import { 
  Card,
  Switch,
  Text
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"

export const TemplateSettings = () => {
  const { register, watch } = useFormContext()
  const inventoryEnabled = watch("settings.inventory_management_enabled")

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Product Settings</h2>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <Switch
              label="Enable Inventory Management"
              {...register("settings.inventory_management_enabled")}
            />
            
            {inventoryEnabled && (
              <div className="ml-6 space-y-2">
                <Switch
                  label="Track Inventory"
                  {...register("settings.track_inventory")}
                />
                <Switch
                  label="Allow Backorders"
                  {...register("settings.allow_backorder")}
                />
              </div>
            )}

            <Switch
              label="Tax Inclusive Pricing"
              {...register("settings.tax_inclusive")}
            />
            <Switch
              label="Requires Shipping"
              {...register("settings.shipping_required")}
            />
          </div>
        </Card.Content>
      </Card>
    </div>
  )
} 