/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { messages } from '../../defaults.js'
import type { FieldContext } from '../../types.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Validation rule that makes a field required when a specified condition is met.
 * This rule is implicit, meaning it runs even when the field value is undefined.
 *
 * @param checker - Callback function that returns true if the field should be required
 *
 * @example
 * vine.string().optional().use(requiredWhen((field) => {
 *   return field.data.role === 'admin'
 * }))
 */
export const requiredWhen = createRule<(field: FieldContext) => boolean>(
  function requiredWhen(_, checker, field) {
    const shouldBeRequired = checker(field)
    if (!field.isDefined && shouldBeRequired) {
      field.report(messages.required, 'required', field)
    }
  },
  {
    implicit: true,
  }
)
