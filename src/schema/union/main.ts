/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { type RefsStore, type UnionNode } from '@vinejs/compiler/types'

import { messages } from '../../defaults.js'
import { UnionConditional } from './conditional.js'
import { ITYPE, OTYPE, COTYPE, PARSE, IS_OF_TYPE } from '../../symbols.js'
import type {
  SchemaTypes,
  ParserOptions,
  ConstructableSchema,
  UnionNoMatchCallback,
  WithJSONSchema,
} from '../../types.js'
import { VineOptional } from '../optional/main.js'
import { VineNull } from '../null/main.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnion<Conditional extends UnionConditional<SchemaTypes>>
  implements
    ConstructableSchema<
      Conditional[typeof ITYPE],
      Conditional[typeof OTYPE],
      Conditional[typeof COTYPE]
    >,
    WithJSONSchema
{
  declare [ITYPE]: Conditional[typeof ITYPE];
  declare [OTYPE]: Conditional[typeof OTYPE];
  declare [COTYPE]: Conditional[typeof COTYPE]

  #conditionals: Conditional[]
  #otherwiseCallback: UnionNoMatchCallback<Record<string, unknown>> = (_, field) => {
    field.report(messages.union, 'union', field)
  }

  constructor(conditionals: Conditional[]) {
    this.#conditionals = conditionals
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   */
  optional() {
    const optional = new VineOptional<undefined>()
    return new VineUnion<UnionConditional<VineOptional<undefined>> | Conditional>([
      new UnionConditional(optional[IS_OF_TYPE], optional),
      ...this.#conditionals,
    ])
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   *
   * If `optional` and `nullable` are used together, then both undefined
   * and null values will be allowed.
   */
  nullable() {
    const nullable = new VineNull()
    return new VineUnion<UnionConditional<VineNull> | Conditional>([
      new UnionConditional(nullable[IS_OF_TYPE], nullable),
      ...this.#conditionals,
    ])
  }

  /**
   * Define a fallback method to invoke when all of the union conditions
   * fail. You may use this method to report an error.
   */
  otherwise(callback: UnionNoMatchCallback<Record<string, unknown>>): this {
    this.#otherwiseCallback = callback
    return this
  }

  /**
   * Transforms into JSONSchema.
   */
  toJSONSchema(): JSONSchema7 {
    return {
      anyOf: this.#conditionals.map((conditional) => conditional.toJSONSchema()).filter(Boolean),
    }
  }

  /**
   * Clones the VineUnion schema type.
   */
  clone(): this {
    const cloned = new VineUnion<Conditional>(this.#conditionals)
    cloned.otherwise(this.#otherwiseCallback)

    return cloned as this
  }

  /**
   * Compiles to a union
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): UnionNode {
    return {
      type: 'union',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
      conditions: this.#conditionals.map((conditional) =>
        conditional[PARSE](propertyName, refs, options)
      ),
    }
  }
}
