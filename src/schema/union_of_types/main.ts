/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import type { RefsStore, UnionNode } from '@vinejs/compiler/types'

import { messages } from '../../defaults.js'
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
 * Vine union of types represents a union data type that automatically
 * determines which schema to apply based on the value's type.
 *
 * Unlike regular unions that require explicit conditionals, unionOfTypes
 * uses each schema's IS_OF_TYPE method to automatically detect the
 * appropriate schema based on the input value's type.
 *
 * @template Schema - The schema types that make up this union
 *
 * @example
 * const schema = vine.unionOfTypes([
 *   vine.string(),
 *   vine.number(),
 *   vine.boolean()
 * ])
 *
 * @example
 * const schema = vine.unionOfTypes([
 *   vine.object({ type: vine.literal('user'), name: vine.string() }),
 *   vine.object({ type: vine.literal('admin'), permissions: vine.array(vine.string()) })
 * ])
 */
export class VineUnionOfTypes<Schema extends SchemaTypes>
  implements
    ConstructableSchema<Schema[typeof ITYPE], Schema[typeof OTYPE], Schema[typeof COTYPE]>,
    WithJSONSchema
{
  /**
   * The input type of the schema
   */
  declare [ITYPE]: Schema[typeof ITYPE];

  /**
   * The output type of the schema
   */
  declare [OTYPE]: Schema[typeof OTYPE];

  /**
   * The camelCase output type of the schema
   */
  declare [COTYPE]: Schema[typeof COTYPE]

  /**
   * Array of schemas to match against
   */
  #schemas: Schema[]

  /**
   * Callback to invoke when no schema type matches
   */
  #otherwiseCallback: UnionNoMatchCallback<Record<string, unknown>> = (_, field) => {
    field.report(messages.unionOfTypes, 'unionOfTypes', field)
  }

  /**
   * Creates a new VineUnionOfTypes instance with the specified schemas.
   *
   * @param schemas - Array of schemas to match against input values
   */
  constructor(schemas: Schema[]) {
    this.#schemas = schemas
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
   * Clones the VineUnionOfTypes schema type.
   */
  clone(): this {
    const cloned = new VineUnionOfTypes<Schema>(this.#schemas.map((schema) => schema.clone()))
    cloned.otherwise(this.#otherwiseCallback)

    return cloned as this
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   */
  optional() {
    return new VineUnionOfTypes<VineOptional<undefined> | Schema>([
      new VineOptional(),
      ...this.#schemas,
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
    return new VineUnionOfTypes<VineNull | Schema>([new VineNull(), ...this.#schemas])
  }

  /**
   * Transforms into JSONSchema.
   */
  toJSONSchema(): JSONSchema7 {
    return {
      anyOf: this.#schemas.map((schema) => schema.toJSONSchema?.()).filter(Boolean),
    }
  }

  /**
   * Compiles the union of types schema to a compiler node.
   *
   * Creates conditional branches for each schema using their IS_OF_TYPE
   * methods to determine which schema matches the input value.
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
      conditions: this.#schemas.map((schema) => {
        return {
          conditionalFnRefId: refs.trackConditional((value, field) => {
            return schema[IS_OF_TYPE]!(value, field)
          }),
          schema: schema[PARSE](propertyName, refs, options),
        }
      }),
    }
  }
}
