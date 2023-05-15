/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ObjectNode, RefsStore } from '@vinejs/compiler/types'
import { BaseObjectType } from './base.js'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends BaseObjectType<any, any>> extends BaseObjectType<
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
  compile(propertyName: string, refs: RefsStore): ObjectNode {
    return this.#parent.compile(propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
export class OptionalModifier<Schema extends BaseObjectType<any, any>> extends BaseObjectType<
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
  compile(propertyName: string, refs: RefsStore): ObjectNode {
    return this.#parent.compile(propertyName, refs)
  }
}
