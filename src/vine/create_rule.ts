/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { JsonSchemaModifier, Validation, ValidationRule, Validator } from '../types.js'

/**
 * Returns args for the validation function.
 */
type GetArgs<T> = undefined extends T ? [options?: T] : [options: T]

/**
 * Convert a validator function to a rule that you can apply
 * to any schema type using the `schema.use` method.
 */
export function createRule<Options = undefined>(
  validator: Validator<Options>,
  metaData?: {
    name?: string
    implicit?: boolean
    isAsync?: boolean
    json?: JsonSchemaModifier<Options>
  }
) {
  const rule: ValidationRule<Options> = {
    validator,
    name: metaData?.name ?? validator.name,
    isAsync: metaData?.isAsync || validator.constructor.name === 'AsyncFunction',
    implicit: metaData?.implicit ?? false,
    jsonSchema: metaData?.json,
  }

  return function (...options: GetArgs<Options>): Validation<Options> {
    return {
      rule,
      options: options[0],
    }
  }
}
