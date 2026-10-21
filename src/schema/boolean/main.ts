/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { booleanRule } from './rules.js'
import { helpers } from '../../vine/helpers.js'
import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineBoolean represents a boolean value in the validation schema.
 * It accepts boolean, string, and number inputs and converts them to booleans,
 * with support for both strict and loose type checking.
 *
 * @example
 * const schema = vine.boolean()
 *
 * const result = await vine.validate({
 *   schema,
 *   data: "true" // Will be converted to true
 * })
 */
export class VineBoolean extends BaseLiteralType<boolean | string | number, boolean, boolean> {
  /**
   * Static collection of all available validation rules for booleans
   */
  static rules = {
    boolean: booleanRule,
  }

  declare options: FieldOptions & { strict?: boolean };

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'boolean';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.boolean';

  /**
   * Type checker function to determine if a value can be converted to a boolean.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value can be converted to a boolean
   */
  [IS_OF_TYPE] = (value: unknown) => {
    const valueAsBoolean = this.options.strict === true ? value : helpers.asBoolean(value)
    return typeof valueAsBoolean === 'boolean'
  }

  /**
   * Creates a new VineBoolean instance with optional configuration.
   *
   * @param options - Field options like bail mode, nullability and strict mode
   * @param validations - Initial set of validations to apply
   */
  constructor(
    options?: Partial<FieldOptions> & { strict?: boolean },
    validations?: Validation<any>[]
  ) {
    super(options, validations || [booleanRule(options || {})])
  }

  /**
   * Clones the VineBoolean schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineBoolean schema
   */
  clone(): this {
    return new VineBoolean(this.cloneOptions(), this.cloneValidations()) as this
  }
}
