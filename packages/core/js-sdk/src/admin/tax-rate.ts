import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

const taxRateUrl = "/admin/tax-rates"

export class TaxRate {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateTaxRate,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(taxRateUrl, {
      method: "POST",
      headers,
      body,
      query,
    })
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateTaxRate,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminTaxRateDeleteResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateResponse>(
      `${taxRateUrl}/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  async list(
    query?: HttpTypes.AdminTaxRateListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminTaxRateListResponse>(
      taxRateUrl,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }
}
