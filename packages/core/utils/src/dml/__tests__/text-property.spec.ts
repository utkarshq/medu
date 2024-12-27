import { expectTypeOf } from "expect-type"
import { TextProperty } from "../properties/text"

describe("Text property", () => {
  test("create text property type", () => {
    const property = new TextProperty()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: { searchable: false },
      },
      nullable: false,
      computed: false,
      indexes: [],
      relationships: [],
    })
  })

  test("mark text property as primary key", () => {
    const property = new TextProperty().primaryKey()

    expectTypeOf(property["$dataType"]).toEqualTypeOf<string>()
    expect(property.parse("username")).toEqual({
      fieldName: "username",
      dataType: {
        name: "text",
        options: { searchable: false },
      },
      nullable: false,
      computed: false,
      indexes: [],
      relationships: [],
      primaryKey: true,
    })
  })
})
