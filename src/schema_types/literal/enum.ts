/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from './base.js'

export class VineEnum<const Values extends readonly unknown[]> extends BaseLiteralType<
  Values[number],
  Values[number]
> {
  #values: Values

  constructor(values: Values) {
    super()
    this.#values = values
  }
}
