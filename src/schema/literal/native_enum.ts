/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from './base.js'
import type { EnumLike } from '../../types.js'
import { enumRule } from '../../rules/enum.js'

/**
 * VineNativeEnum represents a enum data type that performs validation
 * against a pre-defined choices list.
 *
 * The choices list is derived from TypeScript enum data type or an
 * object
 */
export class VineNativeEnum<Values extends EnumLike> extends BaseLiteralType<
  Values[keyof Values],
  Values[keyof Values]
> {
  constructor(values: Values) {
    super()
    this.use(enumRule({ choices: Object.values(values) }))
  }
}
