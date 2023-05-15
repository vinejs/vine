/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RefsStore, TupleNode } from '@vinejs/compiler/types'
import { BaseTupleType } from './base.js'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends BaseTupleType<any, any>> extends BaseTupleType<
  Schema['__brand'],
  Schema['__camelCaseBrand']
> {
  declare __brand: Schema['__brand'] | null
  declare __camelCaseBrand: Schema['__brand'] | null

  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  compile(propertyName: string, refs: RefsStore): TupleNode {
    return this.#parent.compile(propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
export class OptionalModifier<Schema extends BaseTupleType<any, any>> extends BaseTupleType<
  Schema['__brand'],
  Schema['__camelCaseBrand']
> {
  declare __brand: Schema['__brand'] | undefined
  declare __camelCaseBrand: Schema['__brand'] | undefined

  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  compile(propertyName: string, refs: RefsStore): TupleNode {
    return this.#parent.compile(propertyName, refs)
  }
}
