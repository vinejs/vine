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

import { OTYPE, COTYPE, PARSE, IS_OF_TYPE } from '../../symbols.js'
import type {
  SchemaTypes,
  ParserOptions,
  ConstructableSchema,
  UnionNoMatchCallback,
} from '../../types.js'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnionOfTypes<Schema extends SchemaTypes>
  implements ConstructableSchema<Schema[typeof OTYPE], Schema[typeof COTYPE]>
{
  declare [OTYPE]: Schema[typeof OTYPE];
  declare [COTYPE]: Schema[typeof COTYPE]

  #schemas: Schema[]
  #otherwiseCallback?: UnionNoMatchCallback<Record<string, unknown>>

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
    const cloned = new VineUnionOfTypes<Schema>(this.#schemas)
    if (this.#otherwiseCallback) {
      cloned.otherwise(this.#otherwiseCallback)
    }

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
      elseConditionalFnRefId: this.#otherwiseCallback
        ? refs.trackConditional(this.#otherwiseCallback)
        : undefined,
      conditions: this.#schemas.map((schema) => {
        return {
          conditionalFnRefId: refs.trackConditional((value, ctx) => {
            return schema[IS_OF_TYPE]!(value, ctx)
          }),
          schema: schema[PARSE](propertyName, refs, options),
        }
      }),
    }
  }
}
