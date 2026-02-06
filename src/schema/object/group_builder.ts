/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectGroup } from './group.js'
import { type CamelCase } from '../camelcase_types.js'
import { GroupConditional } from './conditional.js'
import { type OTYPE, type COTYPE, type ITYPE } from '../../symbols.js'
import type { FieldContext, SchemaTypes, UndefinedOptional } from '../../types.js'

/**
 * Creates an object group that conditionally merges properties into an existing object
 * based on runtime validation logic. Groups enable dynamic schema composition where
 * different properties are required based on conditional rules.
 *
 * @param conditionals - Array of conditional property sets to evaluate
 * @returns ObjectGroup instance that can be merged into a VineObject
 *
 * @example
 * const schema = vine.object({
 *   account_type: vine.string()
 * }).merge(
 *   vine.group([
 *     vine.group.if((value) => value.account_type === 'personal', {
 *       first_name: vine.string(),
 *       last_name: vine.string()
 *     }),
 *     vine.group.if((value) => value.account_type === 'business', {
 *       company_name: vine.string(),
 *       tax_id: vine.string()
 *     })
 *   ])
 * )
 */
export function group<Conditional extends GroupConditional<any, any, any, any>>(
  conditionals: Conditional[]
) {
  return new ObjectGroup<Conditional>(conditionals)
}

/**
 * Wraps object properties inside a conditional statement that evaluates at validation time.
 * Properties are only validated and merged if the condition returns a truthy value.
 *
 * @param conditon - Callback function that receives the object value and field context
 * @param properties - Properties to merge when the condition is truthy
 * @returns GroupConditional instance for use in vine.group()
 *
 * @example
 * vine.group([
 *   vine.group.if(
 *     (value) => value.type === 'admin',
 *     {
 *       permissions: vine.array(vine.string()),
 *       access_level: vine.number()
 *     }
 *   ),
 *   vine.group.if(
 *     (value) => value.type === 'user',
 *     {
 *       username: vine.string()
 *     }
 *   )
 * ])
 */
group.if = function groupIf<Properties extends Record<string, SchemaTypes>>(
  conditon: (value: Record<string, unknown>, field: FieldContext) => any,
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    UndefinedOptional<{
      [K in keyof Properties]: Properties[K][typeof ITYPE]
    }>,
    UndefinedOptional<{
      [K in keyof Properties]: Properties[K][typeof OTYPE]
    }>,
    UndefinedOptional<{
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
    }>
  >(conditon, properties)
}

/**
 * Wraps object properties inside an "else" condition that always evaluates to true.
 * Use this as a fallback when no other conditions in the group match.
 *
 * @param properties - Properties to merge when no other condition matches
 * @returns GroupConditional instance that always matches
 *
 * @example
 * vine.group([
 *   vine.group.if((value) => value.role === 'admin', {
 *     admin_key: vine.string()
 *   }),
 *   vine.group.else({
 *     user_key: vine.string()
 *   })
 * ])
 */
group.else = function groupElse<Properties extends Record<string, SchemaTypes>>(
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    UndefinedOptional<{
      [K in keyof Properties]: Properties[K][typeof ITYPE]
    }>,
    UndefinedOptional<{
      [K in keyof Properties]: Properties[K][typeof OTYPE]
    }>,
    UndefinedOptional<{
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
    }>
  >(() => true, properties)
}
