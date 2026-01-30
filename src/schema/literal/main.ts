/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { equalsRule } from './rules.js'
import { helpers } from '../../vine/helpers.js'
import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'
import type { FieldOptions, Literal, Validation, WithJSONSchema } from '../../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineLiteral represents a type that matches an exact value
 */
export class VineLiteral<Value extends Literal>
  extends BaseLiteralType<Value, Value, Value>
  implements WithJSONSchema
{
  /**
   * Default collection of literal rules
   */
  static rules = {
    equals: equalsRule,
  }

  #value: Value;

  /**
   * The subtype of the literal schema field
   */
  [SUBTYPE] = 'literal';

  /**
   * The property must be implemented for "unionOfTypes"
   */
  declare [UNIQUE_NAME]: string;

  /**
   * Checks if the value is of string type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return helpers.compareValues(value, this.#value).isEqual
  }

  constructor(value: Value, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [equalsRule({ expectedValue: value })])
    this.#value = value
    this[UNIQUE_NAME] = `vine.literal.${this.#value}`
  }

  /**
   * Clones the VineLiteral schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineLiteral(this.#value, this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Transforms into JSONSchema.
   */
  toJSONSchema(): JSONSchema7 {
    const schema = super.toJSONSchema()

    if (typeof this.#value === 'string') {
      schema.type = 'string'
      schema.enum = [this.#value]
    }

    if (typeof this.#value === 'boolean') {
      schema.type = 'boolean'
      schema.enum = [this.#value]
    }

    if (typeof this.#value === 'number') {
      schema.type = 'number'
      schema.enum = [this.#value]
    }

    return schema
  }
}
