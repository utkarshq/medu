import { MetadataStorage, MikroORM } from "@mikro-orm/core"
import { model } from "../../entity-builder"
import {
  mikroORMEntityBuilder,
  toMikroOrmEntities,
} from "../../helpers/create-mikro-orm-entity"
import { createDatabase, dropDatabase } from "pg-god"
import { CustomTsMigrationGenerator, mikroOrmSerializer } from "../../../dal"
import { EntityConstructor } from "@medusajs/types"
import { pgGodCredentials } from "../utils"
import { FileSystem } from "../../../common"
import { join } from "path"

export const fileSystem = new FileSystem(
  join(__dirname, "../../integration-tests-migrations-enum")
)

describe("EntityBuilder", () => {
  const dbName = "EntityBuilder-default"

  let orm!: MikroORM
  let User: EntityConstructor<any>

  afterAll(async () => {
    await fileSystem.cleanup()
  })

  beforeEach(async () => {
    MetadataStorage.clear()
    mikroORMEntityBuilder.clear()

    const user = model.define("user", {
      id: model.id().primaryKey(),
      username: model.text(),
      points: model.number().default(0).nullable(),
      tax_rate: model.float().default(0).nullable(),
    })

    ;[User] = toMikroOrmEntities([user])

    await createDatabase({ databaseName: dbName }, pgGodCredentials)

    orm = await MikroORM.init({
      entities: [User],
      tsNode: true,
      dbName,
      password: pgGodCredentials.password,
      host: pgGodCredentials.host,
      user: pgGodCredentials.user,
      type: "postgresql",
      migrations: {
        generator: CustomTsMigrationGenerator,
        path: fileSystem.basePath,
      },
    })

    const migrator = orm.getMigrator()
    await migrator.createMigration()
    await migrator.up()
  })

  afterEach(async () => {
    await orm.close()

    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  })

  it("set the points to default value before creating the record", async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
    })
    expect(user1.points).toBe(undefined)

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const user = await manager.findOne(User, {
      id: user1.id,
    })

    expect(await mikroOrmSerializer(user)).toEqual({
      id: user1.id,
      username: "User 1",
      points: 0,
      tax_rate: 0,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    })
  })

  it("set the points to null when explicitly set to null", async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
      points: null,
    })
    expect(user1.points).toBe(null)

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const user = await manager.findOne(User, {
      id: user1.id,
    })

    expect(await mikroOrmSerializer(user)).toEqual({
      id: user1.id,
      username: "User 1",
      points: null,
      tax_rate: 0,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    })
  })

  it("set the points to null during updated", async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
    })
    expect(user1.points).toBe(undefined)

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    user1.points = null
    await manager.persistAndFlush([user1])

    const user = await manager.findOne(User, {
      id: user1.id,
    })
    expect(await mikroOrmSerializer(user)).toEqual({
      id: user1.id,
      username: "User 1",
      points: null,
      tax_rate: 0,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    })
  })

  it("set the tax rate as a float value", async () => {
    let manager = orm.em.fork()

    const user1 = manager.create(User, {
      username: "User 1",
      tax_rate: 1.2122,
    })
    expect(user1.tax_rate).toEqual(1.2122)

    await manager.persistAndFlush([user1])
    manager = orm.em.fork()

    const user = await manager.findOne(User, {
      id: user1.id,
    })

    expect(await mikroOrmSerializer(user)).toEqual({
      id: user1.id,
      username: "User 1",
      points: 0,
      tax_rate: 1.2122,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      deleted_at: null,
    })
  })
})
