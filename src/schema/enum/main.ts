/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { enumRule } from './rules.js'
import { SUBTYPE } from '../../symbols.js'
import { BaseLiteralType } from '../base/literal.js'
import type { FieldContext, FieldOptions, Validation } from '../../types.js'

/**
 * VineEnum represents an enum data type that performs validation
 * against a pre-defined choices list. It ensures the input value
 * matches one of the allowed enum values exactly.
 *
 * @template Values - The readonly array of allowed enum values
 *
 * @example
 * const schema = vine.enum(['active', 'inactive', 'pending'] as const)
 *
 * const result = await vine.validate({
 *   schema,
 *   data: 'active' // Must be one of the defined values
 * })
 */
export class VineEnum<const Values extends readonly unknown[]> extends BaseLiteralType<
  Values[number],
  Values[number],
  Values[number]
> {
  /**
   * Static collection of all available validation rules for enums
   */
  static rules = {
    enum: enumRule,
  }

  /**
   * The allowed enum values or a function that returns them dynamically
   */
  #values: Values | ((field: FieldContext) => Values);

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'enum'

  /**
   * Returns the enum choices, either static values or function.
   *
   * @returns The enum values or generator function
   */
  getChoices() {
    return this.#values
  }

  /**
   * Creates a new VineEnum instance with the specified allowed values.
   *
   * @param values - Array of allowed values or function returning allowed values
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(
    values: Values | ((field: FieldContext) => Values),
    options?: FieldOptions,
    validations?: Validation<any>[]
  ) {
    super(options, validations || [enumRule({ choices: values })])
    this.#values = values
  }

  /**
   * Clones the VineEnum schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineEnum schema
   */
  clone(): this {
    return new VineEnum(this.#values, this.cloneOptions(), this.cloneValidations()) as this
  }
}
