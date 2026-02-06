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
 * of conditionals and each condition has an associated schema.
 *
 * Unions allow you to define validation logic where different schemas
 * are applied based on runtime conditions. Each conditional is evaluated
 * in order, and the first matching condition's schema is used for validation.
 *
 * @template Conditional - The union conditional type extending UnionConditional
 *
 * @example
 * const schema = vine.object({
 *   userType: vine.string(),
 *   data: vine.union([
 *     vine.union.if(
 *       (value) => value.userType === 'admin',
 *       vine.object({ permissions: vine.array(vine.string()) })
 *     ),
 *     vine.union.else(
 *       vine.object({ role: vine.string() })
 *     )
 *   ])
 * })
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
  /**
   * The input type of the schema
   */
  declare [ITYPE]: Conditional[typeof ITYPE];

  /**
   * The output type of the schema
   */
  declare [OTYPE]: Conditional[typeof OTYPE];

  /**
   * The camelCase output type of the schema
   */
  declare [COTYPE]: Conditional[typeof COTYPE]

  /**
   * Array of conditional branches to evaluate
   */
  #conditionals: Conditional[]

  /**
   * Callback to invoke when no conditional matches
   */
  #otherwiseCallback: UnionNoMatchCallback<Record<string, unknown>> = (_, field) => {
    field.report(messages.union, 'union', field)
  }

  /**
   * Creates a new VineUnion instance with the specified conditionals.
   *
   * @param conditionals - Array of conditional branches to evaluate
   */
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
   * Compiles the union schema to a compiler node.
   *
   * @param propertyName - The name of the property being validated
   * @param refs - Reference store for tracking validators and conditionals
   * @param options - Parser options including camelCase transformation
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
