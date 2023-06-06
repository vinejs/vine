/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from './base.js'
import { stringRule } from '../../rules/primitives.js'

/**
 * VineString represents a string value in the validation schema.
 */
export class VineString extends BaseLiteralType<string, string> {
  constructor() {
    super()
    this.use(stringRule())
  }
}
