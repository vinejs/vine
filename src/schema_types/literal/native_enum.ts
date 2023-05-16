/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EnumLike } from '../../types.js'
import { BaseLiteralType } from './base.js'

export class VineNativeEnum<Values extends EnumLike> extends BaseLiteralType<
  Values[keyof Values],
  Values[keyof Values]
> {
  #values: Values

  constructor(values: Values) {
    super()
    this.#values = values
  }
}
