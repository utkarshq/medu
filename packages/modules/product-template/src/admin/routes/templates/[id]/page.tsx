import React from "react"
import { useParams } from "react-router-dom"
import { 
  Container, 
  Breadcrumbs,
  DetailsPageHeader,
  Section,
  Tab,
  TabContent 
} from "@medusajs/ui"
import { useTemplate } from "../../../hooks/use-template"
import TemplateGeneralSection from "./sections/general"
import TemplateFieldsSection from "./sections/fields"
import TemplateAnalytics from "../../../components/template-analytics"
import TemplateVersionHistory from "../../../components/template-version-history"

const TemplateDetailsPage = () => {
  const { id } = useParams()
  const { template, isLoading } = useTemplate(id)
  const [activeTab, setActiveTab] = React.useState("general")

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Breadcrumbs
        path={[
          { label: "Templates", link: "/templates" },
          { label: template?.title || "Loading..." }
        ]}
      />

      <DetailsPageHeader
        title={template?.title}
        subtitle={template?.description}
        status={
          <Badge variant={template?.status === "published" ? "success" : "default"}>
            {template?.status}
          </Badge>
        }
        actions={[
          <Button 
            variant="secondary"
            onClick={() => {/* Handle duplicate */}}
          >
            Duplicate
          </Button>,
          <Button 
            variant="primary"
            onClick={() => {/* Handle edit */}}
          >
            Edit Template
          </Button>
        ]}
      />

      <div className="mt-4">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List>
            <Tab value="general">General</Tab>
            <Tab value="fields">Fields</Tab>
            <Tab value="analytics">Analytics</Tab>
            <Tab value="versions">Version History</Tab>
          </Tab.List>

          <TabContent value="general">
            <Section>
              <TemplateGeneralSection template={template} />
            </Section>
          </TabContent>

          <TabContent value="fields">
            <Section>
              <TemplateFieldsSection template={template} />
            </Section>
          </TabContent>

          <TabContent value="analytics">
            <Section>
              <TemplateAnalytics templateId={id} />
            </Section>
          </TabContent>

          <TabContent value="versions">
            <Section>
              <TemplateVersionHistory templateId={id} />
            </Section>
          </TabContent>
        </Tab.Group>
      </div>
    </Container>
  )
}

export default TemplateDetailsPage 