"use client"

import type { Operation } from "@/types/openapi"
import type { TagsOperationDescriptionSectionSecurityProps } from "./Security"
import type { TagsOperationDescriptionSectionRequestProps } from "./RequestBody"
import type { TagsOperationDescriptionSectionResponsesProps } from "./Responses"
import dynamic from "next/dynamic"
import TagsOperationDescriptionSectionParameters from "./Parameters"
import MDXContentClient from "@/components/MDXContent/Client"
import { useArea } from "../../../../providers/area"
import { Feedback, Badge, Link, FeatureFlagNotice } from "docs-ui"
import { usePathname } from "next/navigation"
import { TagsOperationDescriptionSectionWorkflowBadgeProps } from "./WorkflowBadge"

const TagsOperationDescriptionSectionSecurity =
  dynamic<TagsOperationDescriptionSectionSecurityProps>(
    async () => import("./Security")
  ) as React.FC<TagsOperationDescriptionSectionSecurityProps>

const TagsOperationDescriptionSectionRequest =
  dynamic<TagsOperationDescriptionSectionRequestProps>(
    async () => import("./RequestBody")
  ) as React.FC<TagsOperationDescriptionSectionRequestProps>

const TagsOperationDescriptionSectionResponses =
  dynamic<TagsOperationDescriptionSectionResponsesProps>(
    async () => import("./Responses")
  ) as React.FC<TagsOperationDescriptionSectionResponsesProps>

const TagsOperationDescriptionSectionWorkflowBadge =
  dynamic<TagsOperationDescriptionSectionWorkflowBadgeProps>(
    async () => import("./WorkflowBadge")
  ) as React.FC<TagsOperationDescriptionSectionWorkflowBadgeProps>

type TagsOperationDescriptionSectionProps = {
  operation: Operation
}
const TagsOperationDescriptionSection = ({
  operation,
}: TagsOperationDescriptionSectionProps) => {
  const { area } = useArea()
  const pathname = usePathname()

  return (
    <>
      <h2>
        {operation.summary}
        {operation.deprecated && (
          <Badge variant="orange" className="ml-0.5">
            deprecated
          </Badge>
        )}
        {operation["x-featureFlag"] && (
          <FeatureFlagNotice
            featureFlag={operation["x-featureFlag"]}
            tooltipTextClassName="font-normal text-medusa-fg-subtle"
            badgeClassName="ml-0.5"
          />
        )}
      </h2>
      <div className="my-1">
        <MDXContentClient content={operation.description} />
      </div>
      {operation["x-workflow"] && (
        <TagsOperationDescriptionSectionWorkflowBadge
          workflow={operation["x-workflow"]}
        />
      )}
      {operation.externalDocs && (
        <>
          Related guide:{" "}
          <Link href={operation.externalDocs.url} target="_blank">
            {operation.externalDocs.description || "Read More"}
          </Link>
        </>
      )}
      <Feedback
        event="survey_api-ref"
        extraData={{
          area,
          section: operation.summary,
        }}
        pathName={pathname}
        className="!my-2"
        vertical={true}
        question="Did this API Route run successfully?"
      />
      {operation.security && (
        <TagsOperationDescriptionSectionSecurity
          security={operation.security}
        />
      )}
      {operation.parameters && (
        <TagsOperationDescriptionSectionParameters
          parameters={operation.parameters}
        />
      )}
      {operation.requestBody && (
        <TagsOperationDescriptionSectionRequest
          requestBody={operation.requestBody}
        />
      )}
      <TagsOperationDescriptionSectionResponses
        responses={operation.responses}
      />
    </>
  )
}

export default TagsOperationDescriptionSection
