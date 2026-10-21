/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type ConditionalFn, type RefsStore, type UnionNode } from '@vinejs/compiler/types'

import { ITYPE, OTYPE, COTYPE, PARSE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes } from '../../types.js'

/**
 * Represents a union conditional type. A conditional is a predicate
 * function combined with a schema that is applied when the predicate
 * evaluates to true.
 *
 * Each conditional acts as a branch in the union, determining which
 * validation schema should be applied based on runtime conditions.
 *
 * @template Schema - The schema type to apply when condition is met
 */
export class UnionConditional<Schema extends SchemaTypes> {
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
   * Schema to apply when conditional is true
   */
  #schema: Schema

  /**
   * Predicate function to evaluate
   */
  #conditional: ConditionalFn<Record<string, unknown>>

  /**
   * Creates a new UnionConditional instance.
   *
   * @param conditional - Function that determines if this branch matches
   * @param schema - Schema to apply when the conditional returns true
   */
  constructor(conditional: ConditionalFn<Record<string, unknown>>, schema: Schema) {
    this.#schema = schema
    this.#conditional = conditional
  }

  /**
   * Transforms the conditional's schema into JSON Schema format.
   */
  toJSONSchema() {
    return this.#schema.toJSONSchema?.()
  }

  /**
   * Compiles the conditional to a union conditional node.
   *
   * @param propertyName - The name of the property being validated
   * @param refs - Reference store for tracking validators and conditionals
   * @param options - Parser options including camelCase transformation
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): UnionNode['conditions'][number] {
    return {
      conditionalFnRefId: refs.trackConditional(this.#conditional),
      schema: this.#schema[PARSE](propertyName, refs, options),
    }
  }
}
