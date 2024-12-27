import React from "react"
import { 
  Input,
  Textarea,
  Select,
  Card
} from "@medusajs/ui"
import { useFormContext } from "react-hook-form"

export const BasicInformation = () => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="flex flex-col gap-y-6">
      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">Basic Details</h2>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 gap-x-8">
            <Input
              label="Template Name"
              placeholder="e.g., Basic T-Shirt Template"
              {...register("title", {
                required: "Template name is required",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters"
                }
              })}
              error={errors.title?.message}
            />
            <Select
              label="Status"
              {...register("status")}
              defaultValue="draft"
              helperText="Published templates can be used to create products"
            >
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="deprecated">Deprecated</Select.Option>
            </Select>
          </div>
          <Textarea
            label="Description"
            placeholder="Describe your template..."
            className="mt-4"
            {...register("description")}
          />
        </Card.Content>
      </Card>
    </div>
  )
} 