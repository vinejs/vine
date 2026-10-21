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
import { SUBTYPE } from '../../symbols.js'

/**
 * VineAccepted represents a checkbox or acceptance field that must be
 * checked or have an accepted value. This is commonly used for terms
 * of service acceptance, privacy policy agreements, etc.
 *
 * Accepted values are: 'on', '1', 'yes', 'true', true, or 1
 * The output is always normalized to the boolean value `true`.
 *
 * @example
 * const schema = vine.object({
 *   termsAccepted: vine.accepted(),
 *   newsletter: vine.accepted().optional()
 * })
 *
 * @example
 * // HTML form checkbox
 * // <input type="checkbox" name="terms" />
 * // When checked, sends "on" which is accepted
 */
export class VineAccepted extends BaseLiteralType<
  'on' | '1' | 'yes' | 'true' | true | 1,
  true,
  true
> {
  /**
   * Static collection of all available validation rules for accepted fields
   */
  static rules = {
    accepted: acceptedRule,
  };

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'checkbox'

  /**
   * Creates a new VineAccepted instance.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations || [acceptedRule()])
  }

  /**
   * Clones the VineAccepted schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineAccepted schema
   */
  clone(): this {
    return new VineAccepted(this.cloneOptions(), this.cloneValidations()) as this
  }
}
