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
import { SUBTYPE } from '../../symbols.js'

/**
 * VineNativeEnum represents an enum data type that performs validation
 * against a pre-defined choices list.
 *
 * The choices list is derived from TypeScript enum data type or an
 * object with string or number values. This allows you to validate
 * against native TypeScript enums.
 *
 * @template Values - The enum-like type containing allowed values
 *
 * @example
 * enum Status {
 *   Active = 'active',
 *   Inactive = 'inactive'
 * }
 *
 * const schema = vine.nativeEnum(Status)
 *
 * @example
 * const Colors = {
 *   RED: 'red',
 *   BLUE: 'blue',
 *   GREEN: 'green'
 * } as const
 *
 * const schema = vine.nativeEnum(Colors)
 */
export class VineNativeEnum<Values extends EnumLike> extends BaseLiteralType<
  Values[keyof Values],
  Values[keyof Values],
  Values[keyof Values]
> {
  /**
   * Static collection of all available validation rules for native enums
   */
  static rules = {
    enum: enumRule,
  }

  /**
   * The enum-like object containing allowed values
   */
  #values: Values;

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'enum'

  /**
   * Creates a new VineNativeEnum instance with the specified enum values.
   *
   * @param values - The enum or enum-like object containing allowed values
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(values: Values, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [enumRule({ choices: Object.values(values) })])
    this.#values = values
  }

  /**
   * Clones the VineNativeEnum schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineNativeEnum schema
   */
  clone(): this {
    return new VineNativeEnum(this.#values, this.cloneOptions(), this.cloneValidations()) as this
  }
}
