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
 * VineAny represents a value that can be anything
 */
export class VineAny extends BaseLiteralType<any, any, any> {
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations)
  }

  /**
   * The subtype of the literal schema field
   */
  [SUBTYPE] = 'any'

  /**
   * Clones the VineAny schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineAny(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Transforms into JSONSchema.
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
