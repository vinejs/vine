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
import type { EnumLike, FieldOptions, Validation } from '../../types.js'

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
  /**
   * Default collection of enum rules
   */
  static rules = {
    enum: enumRule,
  }

  #values: Values

  constructor(values: Values, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [enumRule({ choices: Object.values(values) })])
    this.#values = values
  }

  /**
   * Clones the VineNativeEnum schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineNativeEnum(this.#values, this.cloneOptions(), this.cloneValidations()) as this
  }
}
