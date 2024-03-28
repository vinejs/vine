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

/**
 * VineAny represents a value that can be anything
 */
export class VineAny extends BaseLiteralType<any, any, any> {
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations)
  }

  /**
   * Clones the VineAny schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineAny(this.cloneOptions(), this.cloneValidations()) as this
  }
}
