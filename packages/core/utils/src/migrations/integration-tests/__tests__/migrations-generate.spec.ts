import { join } from "path"
import { setTimeout } from "timers/promises"
import { MetadataStorage } from "@mikro-orm/core"

import { Migrations } from "../../index"
import { FileSystem } from "../../../common"
import { DmlEntity, mikroORMEntityBuilder, model } from "../../../dml"
import { defineMikroOrmCliConfig } from "../../../modules-sdk"

jest.setTimeout(30000)

const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD ?? " "

const dbName = "my-test-service-generate"
const moduleName = "myTestServiceGenerate"
const fs = new FileSystem(join(__dirname, "./migrations-generate"))

const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

describe("Generate migrations", () => {
  beforeEach(async () => {
    await fs.cleanup()
  })

  afterEach(async () => {
    await fs.cleanup()
    MetadataStorage.clear()
    mikroORMEntityBuilder.clear()
  })

  test("generate migrations for a single entity", async () => {
    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [User],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    const results = await migrations.generate()

    expect(await fs.exists(results.fileName))
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "user"/
    )
  })

  test("generate migrations for multiple entities", async () => {
    const User = model
      .define("User", {
        id: model.id().primaryKey(),
        email: model.text().unique(),
        fullName: model.text().nullable(),
        cars: model.hasMany(() => Car),
      })
      .cascades({
        delete: ["cars"],
      })

    const Car = model.define("Car", {
      id: model.id().primaryKey(),
      name: model.text(),
      user: model.belongsTo(() => User, { mappedBy: "cars" }),
    })

    const config = defineMikroOrmCliConfig(moduleName, {
      entities: [User, Car],
      dbName: dbName,
      migrations: {
        path: fs.basePath,
      },
      ...pgGodCredentials,
    })

    const migrations = new Migrations(config)
    const results = await migrations.generate()

    expect(await fs.exists(results.fileName))
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "user"/
    )
    expect(await fs.contents(results.fileName)).toMatch(
      /create table if not exists "car"/
    )
  })

  test("generate new file when entities are added", async () => {
    function run(entities: DmlEntity<any, any>[]) {
      const config = defineMikroOrmCliConfig(moduleName, {
        entities,
        dbName: dbName,
        migrations: {
          path: fs.basePath,
        },
        ...pgGodCredentials,
      })

      const migrations = new Migrations(config)
      return migrations.generate()
    }

    const User = model.define("User", {
      id: model.id().primaryKey(),
      email: model.text().unique(),
      fullName: model.text().nullable(),
    })

    const run1 = await run([User])
    expect(await fs.exists(run1.fileName))

    const Car = model.define("Car", {
      id: model.id().primaryKey(),
      name: model.text(),
    })

    await setTimeout(1000)

    const run2 = await run([User, Car])
    expect(await fs.exists(run2.fileName))

    expect(run1.fileName).not.toEqual(run2.fileName)
  })
})
