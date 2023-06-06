/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../base/literal.js'
import { FieldOptions, Validation } from '../../types.js'
import { maxRule, minRule, negativeRule, numberRule, positiveRule, rangeRule } from './rules.js'

/**
 * VineNumber represents a numeric value in the validation schema.
 */
export class VineNumber extends BaseLiteralType<number, number> {
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
   * Clones the VineNumber schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineNumber(this.cloneOptions(), this.cloneValidations()) as this
  }
}
