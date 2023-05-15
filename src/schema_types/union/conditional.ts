/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ConditionalFn, RefsStore, UnionNode } from '@vinejs/compiler/types'
import type { InferTypes, InferCamelCaseTypes, SchemaTypes } from '../../types.js'

/**
 * Represents a union conditional type. A conditional is a predicate
 * with a schema
 */
export class UnionConditional<
  Input extends SchemaTypes,
  Output extends InferTypes<Input> = InferTypes<Input>,
  CamelCaseOutput extends InferCamelCaseTypes<Input> = InferCamelCaseTypes<Input>
> {
  declare __brand: Output
  declare __camelCaseBrand: CamelCaseOutput

  #schema: Input
  #condition: ConditionalFn

  constructor(conditon: ConditionalFn, schema: Input) {
    this.#schema = schema
    this.#condition = conditon
  }

  /**
   * Compiles to a union conditional
   */
  compile(propertyName: string, refs: RefsStore): UnionNode['conditions'][number] {
    return {
      schema: this.#schema.compile(propertyName, refs),
      conditionalFnRefId: refs.trackConditional(this.#condition),
    }
  }
}
