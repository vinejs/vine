/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerNodes, RefsStore } from '@vinejs/compiler/types'

import { BRAND, CBRAND, PARSE, VALIDATION } from '../symbols.js'
import type {
  Parser,
  Validation,
  RuleBuilder,
  FieldOptions,
  ParserOptions,
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
  abstract [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes

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
    bail: true,
    allowNull: false,
    isOptional: false,
  }

  /**
   * Set of validations to run
   */
  protected validations: Validation<any>[] = []

  /**
   * Compiles validations
   */
  protected compileValidations(refs: RefsStore) {
    return this.validations.map((validation) => {
      return {
        ruleFnId: refs.track({
          validator: validation.rule.validator,
          options: validation.options,
        }),
        implicit: validation.rule.implicit,
        isAsync: validation.rule.isAsync,
      }
    })
  }

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
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
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
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)
    if (output.type !== 'union') {
      output.allowNull = true
    }
    return output
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
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)
    if (output.type !== 'union') {
      output.isOptional = true
    }

    return output
  }
}
