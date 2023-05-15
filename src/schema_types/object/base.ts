/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectNode, RefsStore } from '@vinejs/compiler/types'
import { BaseType } from '../base.js'
import { NullableModifier, OptionalModifier } from './modifiers.js'

/**
 * VineObject represents an object value in the validation
 * schema.
 */
export abstract class BaseObjectType<Output, CamelCaseOutput> extends BaseType<
  Output,
  CamelCaseOutput
> {
  /**
   * Each subtype should implement the compile method that returns
   * one of the known compiler nodes
   */
  abstract compile(propertyName: string, refs: RefsStore): ObjectNode

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
