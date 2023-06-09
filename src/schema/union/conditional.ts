/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConditionalFn, RefsStore, UnionNode } from '@vinejs/compiler/types'

import { OTYPE, COTYPE, PARSE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes } from '../../types.js'

/**
 * Represents a union conditional type. A conditional is a predicate
 * with a schema
 */
export class UnionConditional<Schema extends SchemaTypes> {
  declare [OTYPE]: Schema[typeof OTYPE];
  declare [COTYPE]: Schema[typeof COTYPE]

  /**
   * Properties to merge when conditonal is true
   */
  #schema: Schema

  /**
   * Conditional to evaluate
   */
  #conditional: ConditionalFn<Record<string, unknown>>

  constructor(conditional: ConditionalFn<Record<string, unknown>>, schema: Schema) {
    this.#schema = schema
    this.#conditional = conditional
  }

  /**
   * Compiles to a union conditional
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
