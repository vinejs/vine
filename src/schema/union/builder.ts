/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { VineUnion } from './main.js'
import { UnionConditional } from './conditional.js'
import type { FieldContext, SchemaTypes } from '../../types.js'

/**
 * Create a new union schema type. A union is a collection of conditionals
 * and schema associated with it.
 *
 * Unions evaluate conditionals in order and apply the first matching schema.
 * Use `union.if()` to define conditional branches and `union.else()` for
 * the default fallback.
 *
 * @template Conditional - The union conditional type
 * @param conditionals - Array of conditional branches to evaluate
 *
 * @example
 * const schema = vine.union([
 *   vine.union.if(
 *     (value) => typeof value === 'string',
 *     vine.string()
 *   ),
 *   vine.union.if(
 *     (value) => typeof value === 'number',
 *     vine.number()
 *   )
 * ])
 */
export function union<Conditional extends UnionConditional<any>>(conditionals: Conditional[]) {
  return new VineUnion<Conditional>(conditionals)
}

/**
 * Wrap a schema inside a conditional branch. The condition is evaluated
 * at runtime, and if it returns a truthy value, the associated schema
 * is used for validation.
 *
 * @template Schema - The schema type to apply when condition matches
 * @param conditon - Function that evaluates whether this branch should be used
 * @param schema - The schema to apply if the condition is true
 *
 * @example
 * vine.union.if(
 *   (value) => value.type === 'email',
 *   vine.object({ email: vine.string().email() })
 * )
 */
union.if = function unionIf<Schema extends SchemaTypes>(
  conditon: (value: Record<string, unknown>, field: FieldContext) => any,
  schema: Schema
) {
  return new UnionConditional<Schema>(conditon, schema)
}

/**
 * Wrap a schema inside an else (default) conditional. This branch
 * always matches and should be placed last in the union conditionals array.
 *
 * @template Schema - The schema type to apply as default
 * @param schema - The schema to apply when no other conditions match
 *
 * @example
 * vine.union([
 *   vine.union.if((value) => value.type === 'admin', adminSchema),
 *   vine.union.else(userSchema)
 * ])
 */
union.else = function unionElse<Schema extends SchemaTypes>(schema: Schema) {
  return new UnionConditional<Schema>(() => true, schema)
}
