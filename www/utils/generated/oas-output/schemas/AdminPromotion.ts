/**
 * @schema AdminPromotion
 * type: object
 * description: The promotion's details.
 * x-schemaName: AdminPromotion
 * required:
 *   - id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   application_method:
 *     $ref: "#/components/schemas/AdminApplicationMethod"
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminPromotionRule"
 *   id:
 *     type: string
 *     title: id
 *     description: The promotion's ID.
 *   code:
 *     type: string
 *     title: code
 *     description: The promotion's code.
 *     example: OFF50
 *   type:
 *     type: string
 *     description: The promotion's type.
 *     enum:
 *       - standard
 *       - buyget
 *   is_automatic:
 *     type: boolean
 *     title: is_automatic
 *     description: Whether the promotion is applied on a cart automatically if it matches the promotion's rules.
 *   campaign_id:
 *     type: string
 *     title: campaign_id
 *     description: The ID of the campaign this promotion belongs to.
 *   campaign:
 *     $ref: "#/components/schemas/AdminCampaign"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the promotion was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the promotion was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the promotion was deleted.
 * 
*/

