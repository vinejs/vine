/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ConditionalFn, ObjectGroupNode, RefsStore } from '@vinejs/compiler/types'
import { SchemaTypes } from '../../types.js'
import { COMPILER } from '../../symbols.js'

/**
 * Represents a union conditional type. A conditional is a predicate
 * with a schema
 */
export class GroupConditional<
  Properties extends Record<string, SchemaTypes>,
  Output,
  CamelCaseOutput
> {
  declare __brand: Output
  declare __camelCaseBrand: CamelCaseOutput

  /**
   * Properties to merge when conditonal is true
   */
  #properties: Properties

  /**
   * Conditional to evaluate
   */
  #conditional: ConditionalFn<Record<string, unknown>>

  constructor(conditional: ConditionalFn<Record<string, unknown>>, properties: Properties) {
    this.#properties = properties
    this.#conditional = conditional
  }

  /**
   * Compiles to a union conditional
   */
  [COMPILER](refs: RefsStore): ObjectGroupNode['conditions'][number] {
    return {
      schema: {
        type: 'sub_object',
        properties: Object.keys(this.#properties).map((property) => {
          return this.#properties[property][COMPILER](property, refs)
        }),
        groups: [],
      },
      conditionalFnRefId: refs.trackConditional(this.#conditional),
    }
  }
}
