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
 * Specify an optional value inside a union.
 */
export class VineOptional<Output>
  extends ConditionalValidations
  implements ConstructableSchema<null | undefined, Output, Output>
{
  /**
   * The input type of the schema
   */
  declare [ITYPE]: null | undefined;

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: Output;
  declare [COTYPE]: Output;

  /**
   * The subtype of the literal schema field
   */
  [SUBTYPE]: string = 'optional';

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.optional';

  /**
   * Checks if the value is undefined or null. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value === null || value === undefined
  }

  /**
   * Field options
   */
  protected options: FieldOptions

  /**
   * Set of validations to run
   */
  protected validations: Validation<any>[]

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
   * Shallow clones the validations. Since, there are no API's to mutate
   * the validation options, we can safely copy them by reference.
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
   * Shallow clones the options
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

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
   * Clones the VineNull schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineOptional(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   */
  nullable() {
    return new VineOptional<undefined | null>({
      ...this.options,
      allowNull: true,
    })
  }

  toJSONSchema(): JSONSchema7 & { isOptional: true } {
    return {
      // Custom property allowing object schema type to set property as not required.
      isOptional: true,
    }
  }

  /**
   * Compiles the schema type to a compiler node
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
