import React from "react"
import { 
  NumberInput,
  Select,
  Card,
  Text
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"

export const PriceFieldManager = ({ 
  fieldPath,
  fieldType // "static" | "dynamic" | "optional"
}) => {
  const { register, watch } = useFormContext()
  
  return (
    <div className="space-y-4">
      {(fieldType === "static" || fieldType === "optional") && (
        <Card>
          <Card.Content>
            <div className="grid grid-cols-2 gap-x-4">
              <NumberInput
                label={fieldType === "static" ? "Fixed Price" : "Default Price"}
                {...register(`${fieldPath}.default_value`)}
                min={0}
                step={100} // For cents
                prefix="$"
                decimalScale={2}
                required={fieldType === "static"}
              />
              <Select
                label="Currency"
                {...register(`${fieldPath}.settings.currency`)}
                defaultValue="usd"
              >
                <Select.Option value="usd">USD ($)</Select.Option>
                <Select.Option value="eur">EUR (€)</Select.Option>
                {/* Add other currencies */}
              </Select>
            </div>
            {fieldType === "static" && (
              <Text className="text-ui-fg-subtle mt-2">
                This price will be fixed for all products created from this template
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Price validation settings */}
      <Card>
        <Card.Header>
          <h3 className="text-base font-medium">Price Constraints</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="Minimum Price"
              {...register(`${fieldPath}.settings.min`)}
              min={0}
              step={100}
              prefix="$"
            />
            <NumberInput
              label="Maximum Price"
              {...register(`${fieldPath}.settings.max`)}
              min={0}
              step={100}
              prefix="$"
            />
          </div>
        </Card.Content>
      </Card>
    </div>
  )
} 