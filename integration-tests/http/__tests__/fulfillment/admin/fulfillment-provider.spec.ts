import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Fulfillment Provider API", () => {
      let location

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())

        location = (
          await api.post(
            `/admin/stock-locations`,
            { name: "Test location" },
            adminHeaders
          )
        ).data.stock_location
      })

      describe("GET /admin/fulfillment-providers", () => {
        it("should list all fulfillment providers successfully", async () => {
          const response = await api.get(
            `/admin/fulfillment-providers`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.fulfillment_providers).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "manual_test-provider",
                is_enabled: true,
              }),
              expect.objectContaining({
                id: "manual-calculated_test-provider-calculated",
                is_enabled: true,
              }),
            ])
          )
        })

        it("should list all fulfillment providers scoped by stock location", async () => {
          let response = await api.get(
            `/admin/fulfillment-providers?stock_location_id=${location.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.fulfillment_providers).toEqual([])

          await api.post(
            `/admin/stock-locations/${location.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          response = await api.get(
            `/admin/fulfillment-providers?stock_location_id=${location.id}`,
            adminHeaders
          )

          expect(response.data.fulfillment_providers).toEqual([
            expect.objectContaining({
              id: "manual_test-provider",
              is_enabled: true,
            }),
          ])
        })
      })
    })
  },
})
