/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { booleanRule } from '../../rules/primitives.js'
import { BaseLiteralType } from './base.js'

/**
 * VineBoolean represents a boolean value in the validation schema.
 */
export class VineBoolean extends BaseLiteralType<boolean, boolean> {
  constructor() {
    super()
    this.use(booleanRule())
  }
}
