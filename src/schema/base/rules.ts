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
 * Validates the value to be required when a certain condition
 * is matched
 */
export const requiredWhen = createRule<(field: FieldContext) => boolean>(
  (_, checker, field) => {
    const shouldBeRequired = checker(field)
    if (!field.isDefined && shouldBeRequired) {
      field.report(messages.required, 'required', field)
    }
  },
  {
    implicit: true,
  }
)
