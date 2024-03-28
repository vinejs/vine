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
import { IS_OF_TYPE, UNIQUE_NAME } from '../../symbols.js'
import type { FieldOptions, Validation } from '../../types.js'

/**
 * VineBoolean represents a boolean value in the validation schema.
 */
export class VineBoolean extends BaseLiteralType<boolean | string | number, boolean, boolean> {
  /**
   * Default collection of boolean rules
   */
  static rules = {
    boolean: booleanRule,
  }

  protected declare options: FieldOptions & { strict?: boolean };

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.boolean';

  /**
   * Checks if the value is of boolean type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    const valueAsBoolean = this.options.strict === true ? value : helpers.asBoolean(value)
    return typeof valueAsBoolean === 'boolean'
  }

  constructor(
    options?: Partial<FieldOptions> & { strict?: boolean },
    validations?: Validation<any>[]
  ) {
    super(options, validations || [booleanRule(options || {})])
  }

  /**
   * Clones the VineBoolean schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineBoolean(this.cloneOptions(), this.cloneValidations()) as this
  }
}
