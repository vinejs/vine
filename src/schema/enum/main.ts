/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { enumRule } from './rules.js'
import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineEnum represents a enum data type that performs validation
 * against a pre-defined choices list.
 */
export class VineEnum<const Values extends readonly unknown[]> extends BaseLiteralType<
  Values[number],
  Values[number]
> {
  /**
   * Default collection of enum rules
   */
  static rules = {
    enum: enumRule,
  }

  #values: Values

  constructor(values: Values, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [enumRule({ choices: values })])
    this.#values = values
  }

  /**
   * Clones the VineEnum schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineEnum(this.#values, this.cloneOptions(), this.cloneValidations()) as this
  }
}
