import { Form } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { Steps } from "@medusajs/admin"
import { useNavigate } from "react-router-dom"
import { useCreateTemplate } from "../../hooks/use-create-template"

export const TemplateForm = () => {
  const form = useForm({
    defaultValues: {
      status: "draft",
      required_fields: {
        title: true,
        handle: false
      },
      base_fields: [],
      variant_config: {
        options: [],
        variant_fields: []
      },
      settings: {
        inventory_management_enabled: true,
        tax_inclusive: false,
        shipping_required: true
      }
    }
  })
  
  const navigate = useNavigate()
  const createTemplate = useCreateTemplate()

  const onSubmit = async (data) => {
    try {
      const template = await createTemplate.mutateAsync(data)
      navigate(`/a/templates/${template.id}`)
    } catch (error) {
      // Handle error
    }
  }

  return (
    <Form {...form} onSubmit={onSubmit}>
      <Steps>
        <Steps.Step title="Basic Information">
          <BasicInformation />
        </Steps.Step>
        
        <Steps.Step title="Fields">
          <FieldsConfiguration />
        </Steps.Step>
        
        <Steps.Step title="Variants">
          <VariantConfiguration />
        </Steps.Step>
        
        <Steps.Step title="Settings">
          <TemplateSettings />
        </Steps.Step>
      </Steps>
    </Form>
  )
} 