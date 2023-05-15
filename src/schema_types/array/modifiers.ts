/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ArrayNode, RefsStore } from '@vinejs/compiler/types'
import { BaseArrayType } from './base.js'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends BaseArrayType<any, any>> extends BaseArrayType<
  Schema['__brand'] | null,
  Schema['__camelCaseBrand'] | null
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  compile(propertyName: string, refs: RefsStore): ArrayNode {
    return this.#parent.compile(propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
export class OptionalModifier<Schema extends BaseArrayType<any, any>> extends BaseArrayType<
  Schema['__brand'] | undefined,
  Schema['__camelCaseBrand'] | undefined
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  compile(propertyName: string, refs: RefsStore): ArrayNode {
    return this.#parent.compile(propertyName, refs)
  }
}
