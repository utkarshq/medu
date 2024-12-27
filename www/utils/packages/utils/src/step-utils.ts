import { ArrayType, SignatureReflection, SomeType, UnionType } from "typedoc"

const disallowedIntrinsicTypeNames = ["unknown", "void", "any", "never"]

export function isWorkflowStep(reflection: SignatureReflection): boolean {
  if (reflection.parent?.children?.some((child) => child.name === "__step__")) {
    return true
  }
  if (reflection.type?.type !== "intersection") {
    return false
  }
  return reflection.type.types.some(
    (refType) =>
      refType.type === "reference" &&
      refType.name === "StepFunctionReturnConfig"
  )
}

export function getStepInputType(
  reflection: SignatureReflection
): SomeType | undefined {
  if (!isWorkflowStep(reflection) || !reflection.parameters?.length) {
    return
  }

  return cleanUpType(reflection.parameters[0].type)
}

export function getStepOutputType(
  reflection: SignatureReflection
): SomeType | undefined {
  if (!isWorkflowStep(reflection)) {
    return
  }

  if (
    reflection.type?.type === "intrinsic" &&
    disallowedIntrinsicTypeNames.includes(reflection.type.name)
  ) {
    return
  }

  if (reflection.type?.type !== "intersection") {
    return reflection.type
  }

  if (reflection.type.types.length <= 3) {
    return
  }

  const returnType = reflection.type.types
    .slice(0, 3)
    .find(
      (itemType) =>
        itemType.type !== "reflection" || itemType.declaration.name !== "__type"
    )

  return cleanUpType(returnType)
}

function cleanUpType(itemType: SomeType | undefined): SomeType | undefined {
  switch (itemType?.type) {
    case "union":
      return cleanUpUnionType(itemType)
    case "array":
      return cleanUpArrayType(itemType)
    case "intrinsic":
      if (disallowedIntrinsicTypeNames.includes(itemType.name)) {
        return undefined
      }

      return itemType
    default:
      return itemType
  }
}

function cleanUpUnionType(unionType: UnionType): SomeType {
  const cleanedUpTypes = unionType.types.filter(
    (itemType) =>
      itemType.type !== "reference" || itemType.name !== "WorkflowData"
  )

  return cleanedUpTypes.length === 1
    ? cleanedUpTypes[0]
    : new UnionType(cleanedUpTypes)
}

function cleanUpArrayType(arrayType: ArrayType): SomeType {
  const cleanedUpType = cleanUpType(arrayType.elementType)

  if (!cleanedUpType) {
    return arrayType
  }

  return new ArrayType(cleanedUpType)
}
