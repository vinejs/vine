/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConditionalFn, RefsStore, UnionNode } from '@vinejs/compiler/types'
import { SchemaTypes } from '../../types.js'
import { BRAND, CBRAND, COMPILER } from '../../symbols.js'

/**
 * Represents a union conditional type. A conditional is a predicate
 * with a schema
 */
export class UnionConditional<Schema extends SchemaTypes> {
  declare [BRAND]: Schema[typeof BRAND];
  declare [CBRAND]: Schema[typeof CBRAND]

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
  [COMPILER](propertyName: string, refs: RefsStore): UnionNode['conditions'][number] {
    return {
      schema: this.#schema[COMPILER](propertyName, refs),
      conditionalFnRefId: refs.trackConditional(this.#conditional),
    }
  }
}
