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
 * VineLiteral represents a schema type that matches an exact literal value.
 * It validates that the input exactly matches the specified literal value,
 * supporting string, number, boolean, and null literals.
 *
 * @example
 * const schema = vine.literal('admin')
 *
 * const result = await vine.validate({
 *   schema,
 *   data: 'admin'
 * })
 */
export class VineLiteral<Value extends Literal>
  extends BaseLiteralType<Value, Value, Value>
  implements WithJSONSchema
{
  /**
   * Static collection of all available validation rules for literals
   */
  static rules = {
    equals: equalsRule,
  }

  /**
   * The literal value that must be matched
   */
  #value: Value;

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'literal';

  /**
   * Unique name identifier for union type resolution
   */
  declare [UNIQUE_NAME]: string;

  /**
   * Type checker function to determine if a value matches the literal value.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value matches the literal value
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return helpers.compareValues(value, this.#value).isEqual
  }

  /**
   * Creates a new VineLiteral instance with the specified literal value.
   *
   * @param value - The exact literal value to match
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(value: Value, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [equalsRule({ expectedValue: value })])
    this.#value = value
    this[UNIQUE_NAME] = `vine.literal.${this.#value}`
  }

  /**
   * Clones the VineLiteral schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineLiteral schema
   */
  clone(): this {
    return new VineLiteral(this.#value, this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Converts the schema to JSON Schema format.
   * Generates an enum constraint with the literal value.
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
