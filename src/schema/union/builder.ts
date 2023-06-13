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
 */
export function union<Conditional extends UnionConditional<any>>(conditionals: Conditional[]) {
  return new VineUnion<Conditional>(conditionals)
}

/**
 * Wrap object properties inside a conditonal
 */
union.if = function unionIf<Schema extends SchemaTypes>(
  conditon: (value: Record<string, unknown>, field: FieldContext) => any,
  schema: Schema
) {
  return new UnionConditional<Schema>(conditon, schema)
}

/**
 * Wrap object properties inside an else conditon
 */
union.else = function unionElse<Schema extends SchemaTypes>(schema: Schema) {
  return new UnionConditional<Schema>(() => true, schema)
}
