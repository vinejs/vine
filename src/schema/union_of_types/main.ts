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
  CompilerNodes,
} from '../../types.js'
import { VineOptional } from '../optional/main.js'
import { VineNull } from '../null/main.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnionOfTypes<Schema extends SchemaTypes> implements ConstructableSchema<
  Schema[typeof ITYPE],
  Schema[typeof OTYPE],
  Schema[typeof COTYPE]
> {
  declare [ITYPE]: Schema[typeof ITYPE];
  declare [OTYPE]: Schema[typeof OTYPE];
  declare [COTYPE]: Schema[typeof COTYPE]

  #schemas: Schema[]
  #otherwiseCallback: UnionNoMatchCallback<Record<string, unknown>> = (_, field) => {
    field.report(messages.unionOfTypes, 'unionOfTypes', field)
  }

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
  protected toJSONSchema(nodes: CompilerNodes[]): JSONSchema7 {
    return {
      anyOf: nodes.map((node) => node.jsonSchema),
    }
  }

  /**
   * Compiles to a union
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): UnionNode & { jsonSchema: JSONSchema7 } {
    const parsedConditions = this.#schemas.map((schema) => {
      return {
        conditionalFnRefId: refs.trackConditional((value, field) => {
          return schema[IS_OF_TYPE]!(value, field)
        }),
        schema: schema[PARSE](propertyName, refs, options),
      }
    })

    return {
      type: 'union',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
      conditions: parsedConditions,
      jsonSchema: this.toJSONSchema(parsedConditions.map((c) => c.schema)),
    }
  }
}
