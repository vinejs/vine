/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Validation, ValidationRule, Validator } from '../types.js'

/**
 * Utility type that determines the argument signature for a validation rule factory.
 * Makes options optional when the type can be undefined, required otherwise.
 *
 * @template T - The options type for the validation rule
 */
type GetArgs<T> = undefined extends T ? [options?: T] : [options: T]

/**
 * Creates a reusable validation rule from a validator function.
 * The returned function can be applied to any schema type using the `schema.use()` method.
 * Automatically detects async functions and provides proper metadata.
 *
 * @template Options - The type of options the validator accepts
 * @param validator - The validation function to convert into a rule
 * @param metaData - Optional metadata about the validation rule
 * @param metaData.name - Custom name for the rule (defaults to function name)
 * @param metaData.implicit - Whether the rule runs on null/undefined values
 * @param metaData.isAsync - Whether the validator is async (auto-detected if not specified)
 * @returns A rule factory function that can be used with schema.use()
 *
 * @example
 * // Simple validation rule
 * const isEven = createRule<{ strict?: boolean }>((value, options, field) => {
 *   const num = Number(value)
 *   if (num % 2 !== 0) {
 *     throw new Error('Value must be even')
 *   }
 *   return value
 * })
 *
 * // Usage with schema
 * vine.number().use(isEven({ strict: true }))
 *
 * @example
 * // Async validation rule
 * const checkUnique = createRule<{ table: string }>(async (value, { table }, field) => {
 *   const exists = await database.exists(table, value)
 *   if (exists) {
 *     throw new Error('Value must be unique')
 *   }
 *   return value
 * }, { name: 'unique', isAsync: true })
 *
 * // Usage
 * vine.string().use(checkUnique({ table: 'users' }))
 */
export function createRule<Options = undefined>(
  validator: Validator<Options>,
  metaData?: {
    /** Custom name for the validation rule */
    name?: string
    /** Whether the rule should run on null/undefined values */
    implicit?: boolean
    /** Whether the validator function is async */
    isAsync?: boolean
  }
) {
  const rule: ValidationRule<Options> = {
    validator,
    name: metaData?.name ?? validator.name,
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
