/**
 * @schema AdminProductTypeListResponse
 * type: object
 * description: The paginated list of product types.
 * x-schemaName: AdminProductTypeListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - product_types
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
 *   product_types:
 *     type: array
 *     description: The list of product types.
 *     items:
 *       $ref: "#/components/schemas/AdminProductType"
 * 
*/
