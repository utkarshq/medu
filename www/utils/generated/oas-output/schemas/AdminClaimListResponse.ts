/**
 * @schema AdminClaimListResponse
 * type: object
 * description: The paginated list of claims.
 * x-schemaName: AdminClaimListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - claims
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items.
 *   claims:
 *     type: array
 *     description: The list of claims.
 *     items:
 *       $ref: "#/components/schemas/AdminClaim"
 * 
*/
