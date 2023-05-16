/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerNodes, RefsStore } from '@vinejs/compiler/types'
import { Parser, Validation, Transformer, FieldOptions, ConstructableSchema } from '../types.js'
import { BRAND, CBRAND, COMPILER } from '../symbols.js'

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
  abstract [COMPILER](
    propertyName: string,
    refs: RefsStore,
    transform?: Transformer<any, any>
  ): CompilerNodes

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [BRAND]: Output;
  declare [CBRAND]: CamelCaseOutput

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

/**
 * Modifies the schema type to allow null values
 */
class NullableModifier<Schema extends BaseType<any, any>> extends BaseType<
  Schema[typeof BRAND] | null,
  Schema[typeof CBRAND] | null
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  [COMPILER](propertyName: string, refs: RefsStore): CompilerNodes {
    return this.#parent[COMPILER](propertyName, refs)
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
class OptionalModifier<Schema extends BaseType<any, any>> extends BaseType<
  Schema[typeof BRAND] | undefined,
  Schema[typeof CBRAND] | undefined
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Compiles to compiler node
   */
  [COMPILER](propertyName: string, refs: RefsStore): CompilerNodes {
    return this.#parent[COMPILER](propertyName, refs)
  }
}
