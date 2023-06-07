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
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [stringRule()])
  }

  /**
   * Clones the VineString schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineString(this.cloneOptions(), this.cloneValidations()) as this
  }

  email(...args: Parameters<typeof emailRule>) {
    return this.use(emailRule(...args))
  }

  mobile(...args: Parameters<typeof mobileRule>) {
    return this.use(mobileRule(...args))
  }

  hexCode() {
    return this.use(hexCodeRule())
  }
}
