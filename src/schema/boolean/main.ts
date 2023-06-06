/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { booleanRule } from './rules.js'
import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineBoolean represents a boolean value in the validation schema.
 */
export class VineBoolean extends BaseLiteralType<boolean, boolean> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [booleanRule()])
  }

  /**
   * Clones the VineBoolean schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineBoolean(this.cloneOptions(), this.cloneValidations()) as this
  }
}
