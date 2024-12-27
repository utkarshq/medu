/**
 * @schema AdminPostExchangesShippingReqSchema
 * type: object
 * description: The outbound shipping method's details.
 * x-schemaName: AdminPostExchangesShippingReqSchema
 * required:
 *   - shipping_option_id
 * properties:
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the associated shipping option.
 *   custom_amount:
 *     type: number
 *     title: custom_amount
 *     description: Set a custom amount for the shipping method.
 *   description:
 *     type: string
 *     title: description
 *     description: The shipping method's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed by admin users only.
 *   metadata:
 *     type: object
 *     description: The exchange's metadata, can hold custom key-value pairs.
 * 
*/

