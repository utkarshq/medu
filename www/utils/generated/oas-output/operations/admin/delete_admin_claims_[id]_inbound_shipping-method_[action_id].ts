/**
 * @oas [delete] /admin/claims/{id}/inbound/shipping-method/{action_id}
 * operationId: DeleteClaimsIdInboundShippingMethodAction_id
 * summary: Remove Inbound Shipping Method from Claim
 * x-sidebar-summary: Remove Inbound Shipping Method
 * description: |
 *   Remove the shipping method for returning items in the claim using the `ID` of the method's `SHIPPING_ADD` action.
 * 
 *   Every shipping method has an `actions` property, whose value is an array of actions. You can check the action's name using its `action` property, and use the value of the `id` property.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The claim's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: action_id
 *     in: path
 *     description: The ID of the shipping method's `SHIPPING_ADD` action.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: "curl -X DELETE '{backend_url}/admin/claims/{id}/inbound/shipping-method/{action_id}' \\ -H 'Authorization: Bearer {access_token}'"
 * tags:
 *   - Claims
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminClaimReturnPreviewResponse"
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
 * x-workflow: removeClaimShippingMethodWorkflow
 * 
*/
