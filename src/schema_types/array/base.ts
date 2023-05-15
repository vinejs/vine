/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefsStore, ArrayNode } from '@vinejs/compiler/types'

import { BaseType } from '../base.js'
import { NullableModifier, OptionalModifier } from './modifiers.js'

/**
 * VineArray represents an array schema type in the validation
 * pipeline
 */
export abstract class BaseArrayType<Output, CamelCaseOutput> extends BaseType<
  Output,
  CamelCaseOutput
> {
  abstract compile(propertyName: string, refs: RefsStore): ArrayNode

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier(this)
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   *
   * If `optional` and `nullable` are used together, then both undefined
   * and null values will be allowed.
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier(this)
  }
}
