/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { equalsRule } from './rules.js'
import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineLiteral represents a type that matches an exact value
 */
export class VineLiteral<Value> extends BaseLiteralType<Value, Value> {
  #value: Value

  constructor(value: Value, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [equalsRule({ expectedValue: value })])
    this.#value = value
  }

  /**
   * Clones the VineLiteral schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineLiteral(this.#value, this.cloneOptions(), this.cloneValidations()) as this
  }
}
