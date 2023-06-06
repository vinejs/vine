/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { enumRule } from '../../rules/enum.js'
import { BaseLiteralType } from './base.js'

/**
 * VineEnum represents a enum data type that performs validation
 * against a pre-defined choices list.
 */
export class VineEnum<const Values extends readonly unknown[]> extends BaseLiteralType<
  Values[number],
  Values[number]
> {
  constructor(values: Values) {
    super()
    this.use(enumRule({ choices: values }))
  }
}
