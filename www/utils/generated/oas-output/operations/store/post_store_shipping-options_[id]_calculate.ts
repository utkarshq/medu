/**
 * @oas [post] /store/shipping-options/{id}/calculate
 * operationId: PostShippingOptionsIdCalculate
 * summary: Calculate Shipping Option Price
 * description: Calculate the price of a shipping option in a cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The calculation's details.
 *         required:
 *           - cart_id
 *         properties:
 *           cart_id:
 *             type: string
 *             title: cart_id
 *             description: The ID of the cart the shipping option is used in.
 *           data:
 *             type: object
 *             description: Custom data that's useful for the fulfillment provider to calculate the price.
 *             externalDocs:
 *               url: https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/shipping-options/{id}/calculate' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "cart_id": "{value}"
 *       }'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreShippingOptionResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: calculateShippingOptionsPricesWorkflow
 * 
*/

