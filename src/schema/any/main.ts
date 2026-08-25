/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../base/literal.js'
import type { FieldOptions, Validation } from '../../types.js'
import { SUBTYPE } from '../../symbols.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineAny represents a schema type that accepts any value without validation.
 * It allows strings, numbers, booleans, arrays, objects, and any other type.
 * Use this when you want to accept any input but still want to apply custom validations.
 *
 * @example
 * const schema = vine.any()
 *
 * const result = await vine.validate({
 *   schema,
 *   data: 'any value, including objects and arrays'
 * })
 */
export class VineAny extends BaseLiteralType<any, any, any> {
  /**
   * Creates a new VineAny instance with optional configuration.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations)
  }

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'any'

  /**
   * Clones the VineAny schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineAny schema
   */
  clone(): this {
    return new VineAny(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Converts the schema to JSON Schema format.
   * Returns a schema with an anyOf constraint covering multiple types.
   */
  toJSONSchema(): JSONSchema7 {
    const schema: JSONSchema7 = {
      anyOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'array' },
        { type: 'object' },
      ],
    }

    for (const validation of this.validations) {
      if (!validation.rule.toJSONSchema) continue
      validation.rule.toJSONSchema(schema, validation.options)
    }

    return schema
  }
}
