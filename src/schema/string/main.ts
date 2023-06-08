/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'
import { emailRule, hexCodeRule, mobileRule, stringRule } from './rules.js'

/**
 * VineString represents a string value in the validation schema.
 */
export class VineString extends BaseLiteralType<string, string> {
  static rules = {
    email: emailRule,
    string: stringRule,
    mobile: mobileRule,
    hexCode: hexCodeRule,
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [stringRule()])
  }

  /**
   * Validates the value to be a valid email address
   */
  email(...args: Parameters<typeof emailRule>) {
    return this.use(emailRule(...args))
  }

  /**
   * Validates the value to be a valid mobile number
   */
  mobile(...args: Parameters<typeof mobileRule>) {
    return this.use(mobileRule(...args))
  }

  /**
   * Validates the value to be a valid hex color code
   */
  hexCode() {
    return this.use(hexCodeRule())
  }

  /**
   * Clones the VineString schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineString(this.cloneOptions(), this.cloneValidations()) as this
  }
}
