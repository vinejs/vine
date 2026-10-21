/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.js'
import { BaseLiteralType } from '../base/literal.js'
import { type FieldOptions, type Validation } from '../../types.js'
import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'

import {
  maxRule,
  minRule,
  rangeRule,
  numberRule,
  decimalRule,
  negativeRule,
  positiveRule,
  withoutDecimalsRule,
  inRule,
  nonNegativeRule,
  nonPositiveRule,
} from './rules.js'

/**
 * VineNumber represents a numeric value in the validation schema.
 * It accepts both string and number inputs and converts them to numbers,
 * with comprehensive validation for ranges, decimals, and sign constraints.
 *
 * @example
 * const schema = vine.number()
 *   .min(0)
 *   .max(100)
 *   .decimal([0, 2])
 *
 * const result = await vine.validate({
 *   schema,
 *   data: "42.5"
 * })
 */
export class VineNumber extends BaseLiteralType<string | number, number, number> {
  declare options: FieldOptions & { strict?: boolean }

  /**
   * Static collection of all available validation rules for numbers
   */
  static rules = {
    in: inRule,
    max: maxRule,
    min: minRule,
    range: rangeRule,
    number: numberRule,
    decimal: decimalRule,
    negative: negativeRule,
    positive: positiveRule,
    nonNegativeRule: nonNegativeRule,
    nonPositiveRule: nonPositiveRule,
    withoutDecimals: withoutDecimalsRule,
  };

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'number';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.number';

  /**
   * Type checker function to determine if a value can be converted to a number.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value can be converted to a valid number
   */
  [IS_OF_TYPE] = (value: unknown) => {
    const valueAsNumber = helpers.asNumber(value)
    return !Number.isNaN(valueAsNumber)
  }

  /**
   * Creates a new VineNumber instance with optional configuration.
   *
   * @param options - Field options like bail mode, nullability and strict mode
   * @param validations - Initial set of validations to apply
   */
  constructor(
    options?: Partial<FieldOptions> & { strict?: boolean },
    validations?: Validation<any>[]
  ) {
    super(options, validations || [])
    this.dataTypeValidator = numberRule(options || {})
  }

  /**
   * Enforce a minimum value for the number input.
   *
   * @param value - The minimum allowed value
   * @returns This number schema instance for method chaining
   */
  min(value: number) {
    return this.use(minRule({ min: value }))
  }

  /**
   * Enforce a maximum value for the number input.
   *
   * @param value - The maximum allowed value
   * @returns This number schema instance for method chaining
   */
  max(value: number) {
    return this.use(maxRule({ max: value }))
  }

  /**
   * Enforce value to be within the range of minimum and maximum values.
   *
   * @param value - Tuple containing [min, max] values
   * @returns This number schema instance for method chaining
   */
  range(value: [min: number, max: number]) {
    return this.use(rangeRule({ min: value[0], max: value[1] }))
  }

  /**
   * Enforces the value to be a positive number (greater than 0).
   *
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().positive()  // Accepts 1, 100.5, etc. Rejects 0, -1
   */
  positive() {
    return this.use(positiveRule())
  }

  /**
   * Enforces the value to be a negative number (less than 0).
   *
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().negative()  // Accepts -1, -100.5, etc. Rejects 0, 1
   */
  negative() {
    return this.use(negativeRule())
  }

  /**
   * Enforces the value to be a non-negative number (greater than or equal to 0).
   *
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().nonNegative()  // Accepts 0, 1, 100.5, etc. Rejects -1
   */
  nonNegative() {
    return this.use(nonNegativeRule())
  }

  /**
   * Enforces the value to be a non-positive number (less than or equal to 0).
   *
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().nonPositive()  // Accepts 0, -1, -100.5, etc. Rejects 1
   */
  nonPositive() {
    return this.use(nonPositiveRule())
  }

  /**
   * Enforces the value to have a fixed number or range of decimal places.
   *
   * @param range - Exact number of decimal places or [min, max] range
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().decimal(2)       // Accepts 1.23, rejects 1.2 or 1.234
   * vine.number().decimal([0, 2])  // Accepts 1, 1.2, 1.23
   */
  decimal(range: number | [number, number]) {
    return this.use(decimalRule({ range: Array.isArray(range) ? range : [range] }))
  }

  /**
   * Enforces the value to be an integer without decimal places.
   *
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().withoutDecimals()  // Accepts 42, -10, rejects 42.5
   */
  withoutDecimals() {
    return this.use(withoutDecimalsRule())
  }

  /**
   * Clones the VineNumber schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineNumber schema
   */
  clone(): this {
    return new VineNumber(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Enforces the value to be one of the specified allowed values.
   *
   * @param values - Array of allowed numeric values
   * @returns This number schema instance for method chaining
   *
   * @example
   * vine.number().in([1, 2, 3, 5, 8, 13])  // Only Fibonacci numbers allowed
   */
  in(values: number[]) {
    return this.use(inRule({ values }))
  }
}
