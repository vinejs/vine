/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerNodes, RefsStore } from '@vinejs/compiler/types'
import type {
  Parser,
  Validation,
  Transformer,
  FieldOptions,
  ConstructableSchema,
} from '../types.js'

/**
 * The BaseSchema class abstracts the repetitive parts of creating
 * a custom schema type.
 */
export abstract class BaseType<Output, CamelCaseOutput>
  implements ConstructableSchema<Output, CamelCaseOutput>
{
  /**
   * Each subtype should implement the compile method that returns
   * one of the known compiler nodes
   */
  abstract compile(
    propertyName: string,
    refs: RefsStore,
    transform?: Transformer<any, any>
  ): CompilerNodes

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare __brand: Output
  declare __camelCaseBrand: CamelCaseOutput

  /**
   * Field options
   */
  protected options: FieldOptions = {
    isOptional: false,
    allowNull: false,
    bail: true,
  }

  /**
   * Set of validations to run
   */
  protected validations: Validation<any>[] = []

  /**
   * Define a method to parse the input value. The method
   * is invoked before any validation and hence you must
   * perform type-checking to know the value you are
   * working it.
   */
  parse(callback: Parser): this {
    this.options.parse = callback
    return this
  }

  /**
   * Push a validation to the validations chain.
   */
  use(validation: Validation<any>): this {
    this.validations.push(validation)
    return this
  }

  /**
   * Enable/disable the bail mode. In bail mode, the field validations
   * are stopped after the first error.
   */
  bail(state: boolean) {
    this.options.bail = state
    return this
  }
}
