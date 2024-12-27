import React from "react"
import { 
  Card,
  Accordion,
  Button,
  Text,
  NumberInput,
  Select,
  Switch
} from "@medusajs/ui"
import { useFormContext, useFieldArray } from "react-hook-form"
import { PriceFieldManager } from "./field-types/price-field"

export const TemplateVariantManager = () => {
  const { control, watch, register } = useFormContext()
  const { fields: options, append: appendOption } = useFieldArray({
    control,
    name: "variant_config.options"
  })

  const priceStrategy = watch("variant_config.pricing_strategy") || "static"
  const variantOptions = watch("variant_config.options") || []

  return (
    <div className="space-y-6">
      {/* Variant Price Configuration */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold">Variant Pricing</h3>
          <Text className="text-ui-fg-subtle">Configure how prices are set for variants</Text>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <Select
              label="Pricing Strategy"
              {...register("variant_config.pricing_strategy")}
              defaultValue="static"
            >
              <Select.Option value="static">Fixed Price (Same for all variants)</Select.Option>
              <Select.Option value="option_based">Option-based Pricing</Select.Option>
              <Select.Option value="dynamic">Dynamic (Set during product creation)</Select.Option>
            </Select>

            {priceStrategy === "static" && (
              <PriceFieldManager 
                fieldPath="variant_config.base_price"
                fieldType="static"
              />
            )}

            {priceStrategy === "option_based" && (
              <div className="space-y-4">
                <NumberInput
                  label="Base Price"
                  {...register("variant_config.base_price")}
                  min={0}
                  step={100}
                  prefix="$"
                  decimalScale={2}
                />

                {/* Price adjustments per option */}
                {variantOptions.map((option, optionIndex) => (
                  <Card key={option.id}>
                    <Card.Header>
                      <h4 className="text-base font-medium">
                        {option.title} Price Adjustments
                      </h4>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-2">
                        {option.values?.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex items-center gap-x-4">
                            <Text>{value}</Text>
                            <NumberInput
                              label="Price Adjustment"
                              {...register(
                                `variant_config.price_adjustments.${optionIndex}.values.${value}`
                              )}
                              placeholder="0"
                              step={100}
                              prefix="$"
                              decimalScale={2}
                            />
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Variant Options Configuration */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Variant Options</h3>
            <Text className="text-ui-fg-subtle">Configure the options for your variants</Text>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={() => appendOption({
              title: "",
              values: [],
              required: true
            })}
          >
            Add Option
          </Button>
        </Card.Header>
        <Card.Content>
          <Accordion type="multiple">
            {options.map((option, index) => (
              <VariantOptionItem 
                key={option.id}
                option={option}
                index={index}
              />
            ))}
          </Accordion>
        </Card.Content>
      </Card>
    </div>
  )
}

// Separate component for variant option configuration
const VariantOptionItem = ({ option, index }) => {
  const { register, control } = useFormContext()
  const { fields: values, append: appendValue } = useFieldArray({
    control,
    name: `variant_config.options.${index}.values`
  })

  return (
    <Accordion.Item value={`option-${index}`}>
      <Accordion.Header>
        <div className="flex items-center justify-between w-full">
          <input
            {...register(`variant_config.options.${index}.title`)}
            placeholder="Option Name (e.g., Size, Color)"
            className="text-base"
          />
          <Switch
            {...register(`variant_config.options.${index}.required`)}
            label="Required"
          />
        </div>
      </Accordion.Header>
      <Accordion.Content>
        <div className="space-y-2">
          {values.map((value, valueIndex) => (
            <input
              key={valueIndex}
              {...register(`variant_config.options.${index}.values.${valueIndex}`)}
              placeholder="Option Value"
              className="text-sm"
            />
          ))}
          <Button
            variant="secondary"
            size="small"
            onClick={() => appendValue("")}
          >
            Add Value
          </Button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
} 