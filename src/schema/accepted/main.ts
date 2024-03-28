/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { acceptedRule } from './rules.js'
import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineAccepted represents a checkbox input that must be checked
 */
export class VineAccepted extends BaseLiteralType<
  'on' | '1' | 'yes' | 'true' | true | 1,
  true,
  true
> {
  /**
   * Default collection of accepted rules
   */
  static rules = {
    accepted: acceptedRule,
  }

  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations || [acceptedRule()])
  }

  /**
   * Clones the VineAccepted schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineAccepted(this.cloneOptions(), this.cloneValidations()) as this
  }
}
