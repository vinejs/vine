/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Validation, ValidationRule, Validator } from './types.js'

/**
 * Returns args for the validation function.
 */
type GetArgs<T> = undefined extends T ? [options?: T] : [options: T]

/**
 * Convert a validatior function to a rule that you can
 * apply to any schema type using the `schema.use`
 * method.
 */
export function createRule<Options extends any>(
  validator: Validator<Options>,
  metaData?: {
    implicit?: boolean
    isAsync?: boolean
  }
) {
  const rule: ValidationRule<Options> = {
    validator,
    isAsync: metaData?.isAsync || validator.constructor.name === 'AsyncFunction',
    implicit: metaData?.implicit ?? false,
  }

  return function (...options: GetArgs<Options>): Validation<Options> {
    return {
      rule,
      options: options[0],
    }
  }
}
