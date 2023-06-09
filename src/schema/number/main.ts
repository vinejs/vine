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
import { FieldOptions, Validation } from '../../types.js'
import { IS_OF_TYPE, UNIQUE_NAME } from '../../symbols.js'

import {
  maxRule,
  minRule,
  rangeRule,
  numberRule,
  decimalRule,
  negativeRule,
  positiveRule,
  withoutDecimalsRule,
} from './rules.js'

/**
 * VineNumber represents a numeric value in the validation schema.
 */
export class VineNumber extends BaseLiteralType<number, number> {
  /**
   * Default collection of number rules
   */
  static rules = {
    max: maxRule,
    min: minRule,
    range: rangeRule,
    number: numberRule,
    decimal: decimalRule,
    negative: negativeRule,
    positive: positiveRule,
    withoutDecimals: withoutDecimalsRule,
  };

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.number';

  /**
   * Checks if the value is of number type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    const valueAsNumber = helpers.asNumber(value)
    return !Number.isNaN(valueAsNumber)
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [numberRule()])
  }

  /**
   * Enforce a minimum value for the number input
   */
  min(value: number) {
    return this.use(minRule({ min: value }))
  }

  /**
   * Enforce a maximum value for the number input
   */
  max(value: number) {
    return this.use(maxRule({ max: value }))
  }

  /**
   * Enforce value to be within the range of minimum and maximum output.
   */
  range(value: [min: number, max: number]) {
    return this.use(rangeRule({ min: value[0], max: value[1] }))
  }

  /**
   * Enforce the value be a positive number
   */
  positive() {
    return this.use(positiveRule())
  }

  /**
   * Enforce the value be a negative number
   */
  negative() {
    return this.use(negativeRule())
  }

  /**
   * Enforce the value to have fixed or range
   * of decimal places
   */
  decimal(range: number | [number, number]) {
    return this.use(decimalRule({ range: Array.isArray(range) ? range : [range] }))
  }

  /**
   * Enforce the value to be an integer (aka without decimals)
   */
  withoutDecimals() {
    return this.use(withoutDecimalsRule())
  }

  /**
   * Clones the VineNumber schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineNumber(this.cloneOptions(), this.cloneValidations()) as this
  }
}
