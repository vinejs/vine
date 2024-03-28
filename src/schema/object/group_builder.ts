/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectGroup } from './group.js'
import { CamelCase } from '../camelcase_types.js'
import { GroupConditional } from './conditional.js'
import { OTYPE, COTYPE, ITYPE } from '../../symbols.js'
import type { FieldContext, SchemaTypes } from '../../types.js'

/**
 * Create an object group. Groups are used to conditionally merge properties
 * to an existing object.
 */
export function group<Conditional extends GroupConditional<any, any, any, any>>(
  conditionals: Conditional[]
) {
  return new ObjectGroup<Conditional>(conditionals)
}

/**
 * Wrap object properties inside a conditonal
 */
group.if = function groupIf<Properties extends Record<string, SchemaTypes>>(
  conditon: (value: Record<string, unknown>, field: FieldContext) => any,
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    {
      [K in keyof Properties]: Properties[K][typeof ITYPE]
    },
    {
      [K in keyof Properties]: Properties[K][typeof OTYPE]
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
    }
  >(conditon, properties)
}

/**
 * Wrap object properties inside an else conditon
 */
group.else = function groupElse<Properties extends Record<string, SchemaTypes>>(
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    {
      [K in keyof Properties]: Properties[K][typeof ITYPE]
    },
    {
      [K in keyof Properties]: Properties[K][typeof OTYPE]
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
    }
  >(() => true, properties)
}
