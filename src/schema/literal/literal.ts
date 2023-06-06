/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from './base.js'
import { equalsRule } from '../../rules/primitives.js'

/**
 * VineLiteral represents a type that matches an exact value
 */
export class VineLiteral<Value> extends BaseLiteralType<Value, Value> {
  constructor(value: Value) {
    super()
    this.use(equalsRule({ expectedValue: value }))
  }
}
