import { RouteConfig } from "@medusajs/admin"
import { TemplateForm } from "../../../components/template-form"

const NewTemplate = () => {
  return (
    <div>
      <div className="flex gap-x-2 items-center mb-4">
        <h1 className="text-2xl font-semibold">Create Template</h1>
      </div>
      <TemplateForm />
    </div>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Templates",
    icon: TemplateIcon
  }
}

export default NewTemplate 