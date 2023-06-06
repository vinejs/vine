/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../literal/base.js'
import { maxRule, minRule, negativeRule, numberRule, positiveRule, rangeRule } from './rules.js'

/**
 * VineNumber represents a numeric value in the validation schema.
 */
export class VineNumber extends BaseLiteralType<number, number> {
  constructor() {
    super()
    this.use(numberRule())
  }

  min(value: number) {
    return this.use(minRule({ min: value }))
  }

  max(value: number) {
    return this.use(maxRule({ max: value }))
  }

  range(value: [min: number, max: number]) {
    return this.use(rangeRule({ min: value[0], max: value[1] }))
  }

  positive() {
    return this.use(positiveRule())
  }

  negative() {
    return this.use(negativeRule())
  }
}
