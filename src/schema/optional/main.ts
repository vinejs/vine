/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import type { LiteralNode, RefsStore } from '@vinejs/compiler/types'
import {
  OTYPE,
  COTYPE,
  PARSE,
  ITYPE,
  SUBTYPE,
  VALIDATION,
  UNIQUE_NAME,
  IS_OF_TYPE,
} from '../../symbols.js'
import type {
  Parser,
  Validation,
  RuleBuilder,
  FieldOptions,
  ParserOptions,
  ConstructableSchema,
} from '../../types.js'
import { ConditionalValidations } from '../base/conditional_rules.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineOptional represents an optional value inside a union or schema.
 * It allows both null and undefined values to pass validation.
 *
 * This type is typically used with unions to make certain branches
 * optional, or to explicitly mark a field as allowing undefined/null values.
 *
 * @template Output - The output type when the value is defined
 *
 * @example
 * const schema = vine.object({
 *   name: vine.string().optional()
 * })
 *
 * @example
 * const schema = vine.unionOfTypes([
 *   vine.string(),
 *   vine.optional()
 * ])
 */
export class VineOptional<Output>
  extends ConditionalValidations
  implements ConstructableSchema<null | undefined, Output, Output>
{
  /**
   * The input type of the schema (null or undefined)
   */
  declare [ITYPE]: null | undefined;

  /**
   * The output type of the schema when value is defined
   */
  declare [OTYPE]: Output;

  /**
   * The camelCase output type of the schema
   */
  declare [COTYPE]: Output;

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE]: string = 'optional';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.optional';

  /**
   * Type checker function to determine if a value is optional (null or undefined).
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value === null || value === undefined
  }

  /**
   * Field options controlling validation behavior
   */
  protected options: FieldOptions

  /**
   * Set of validations to run on the field
   */
  protected validations: Validation<any>[]

  /**
   * Creates a new VineOptional instance.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super()
    this.options = {
      bail: true,
      allowNull: false,
      isOptional: true,
      ...options,
    }
    this.validations = validations || []
  }

  /**
   * Shallow clones the validations. Since there are no APIs to mutate
   * the validation options, we can safely copy them by reference.
   *
   * @returns Array of cloned validation objects
   */
  protected cloneValidations(): Validation<any>[] {
    return this.validations.map((validation) => {
      return {
        options: validation.options,
        rule: validation.rule,
      }
    })
  }

  /**
   * Shallow clones the field options.
   *
   * @returns Cloned field options object
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

  /**
   * Compiles validations into a format suitable for the compiler.
   *
   * @param refs - Reference store for tracking validators
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
   * perform type-checking to know the value you are working with.
   *
   * @param callback - Parser function to transform the input value
   */
  parse(callback: Parser): this {
    this.options.parse = callback
    return this
  }

  /**
   * Push a validation to the validations chain.
   *
   * @param validation - Validation rule or rule builder to add
   */
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
    return this
  }

  /**
   * Enable/disable the bail mode. In bail mode, the field validations
   * are stopped after the first error.
   *
   * @param state - True to enable bail mode, false to disable
   */
  bail(state: boolean) {
    this.options.bail = state
    return this
  }

  /**
   * Clones the VineOptional schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineOptional schema
   */
  clone(): this {
    return new VineOptional(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Mark the field under validation to be nullable. The null value will
   * be written to the output as well. When combined with optional,
   * both null and undefined values are allowed.
   */
  nullable() {
    return new VineOptional<undefined | null>({
      ...this.options,
      allowNull: true,
    })
  }

  /**
   * Transforms into JSON Schema format.
   */
  toJSONSchema(): JSONSchema7 {
    return {}
  }

  /**
   * Compiles the schema type to a compiler node.
   *
   * @param propertyName - The name of the property being validated
   * @param refs - Reference store for tracking validators and parsers
   * @param options - Parser options including camelCase transformation
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string } {
    return {
      type: 'literal',
      subtype: this[SUBTYPE],
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}
