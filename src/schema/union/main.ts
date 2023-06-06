/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, UnionNode } from '@vinejs/compiler/types'

import { UnionConditional } from './conditional.js'
import { BRAND, CBRAND, PARSE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes, UnionNoMatchCallback } from '../../types.js'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnion<Conditional extends UnionConditional<SchemaTypes>> {
  declare [BRAND]: Conditional[typeof BRAND];
  declare [CBRAND]: Conditional[typeof CBRAND]

  #conditionals: Conditional[]
  #otherwiseCallback?: UnionNoMatchCallback<Record<string, unknown>>

  constructor(conditionals: Conditional[]) {
    this.#conditionals = conditionals
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
      conditions: this.#conditionals.map((conditional) =>
        conditional[PARSE](propertyName, refs, options)
      ),
    }
  }
}
