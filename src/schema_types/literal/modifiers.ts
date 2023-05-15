/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { LiteralNode, RefsStore } from '@vinejs/compiler/types'
import { BaseLiteralType } from './base.js'
import { Transformer } from '../../types.js'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends BaseLiteralType<any, any>> extends BaseLiteralType<
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
  compile(propertyName: string, refs: RefsStore): LiteralNode {
    return this.#parent.compile(propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
export class OptionalModifier<Schema extends BaseLiteralType<any, any>> extends BaseLiteralType<
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
  compile(propertyName: string, refs: RefsStore): LiteralNode {
    return this.#parent.compile(propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow custom transformed values
 */
export class TransformModifier<
  Schema extends BaseLiteralType<any, any>,
  Output
> extends BaseLiteralType<Output, Output> {
  #parent: Schema
  #transform: Transformer<Schema, Output>

  constructor(transform: Transformer<Schema, Output>, parent: Schema) {
    super()
    this.#transform = transform
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  compile(propertyName: string, refs: RefsStore): LiteralNode {
    return this.#parent.compile(propertyName, refs, this.#transform)
  }
}
