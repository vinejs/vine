/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { LiteralNode, RefsStore } from '@vinejs/compiler/types'

import { BaseType } from '../base.js'
import type { Transformer } from '../../types.js'
import { NullableModifier, OptionalModifier, TransformModifier } from './modifiers.js'

/**
 * The base type for creating a custom literal type. Literal type
 * is a schema type that has no children elements.
 */
export abstract class BaseLiteralType<Output, CamelCaseOutput> extends BaseType<
  Output,
  CamelCaseOutput
> {
  /**
   * Compiles the schema type to a compiler node
   */
  compile(propertyName: string, refs: RefsStore, transform?: Transformer<any, any>): LiteralNode {
    return {
      type: 'literal',
      fieldName: propertyName,
      propertyName: propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      transformFnId: transform ? refs.trackTransformer(transform) : undefined,
      validations: this.validations.map((validation) => {
        return {
          ruleFnId: refs.track({
            validator: validation.rule.validator,
            options: validation.options,
          }),
          implicit: validation.rule.implicit,
          isAsync: validation.rule.isAsync,
        }
      }),
    }
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier<this>(this)
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   *
   * If `optional` and `nullable` are used together, then both undefined
   * and null values will be allowed.
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier<this>(this)
  }

  /**
   * Apply transform on the final validated value. The transform method may
   * convert the value to any new datatype.
   */
  transform<TransformedOutput>(
    transformer: Transformer<this, TransformedOutput>
  ): TransformModifier<this, TransformedOutput> {
    return new TransformModifier(transformer, this)
  }
}
