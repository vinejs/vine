/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Array of accepted values for checkbox/acceptance validation
 */
const ACCEPTED_VALUES = ['on', '1', 'yes', 'true', true, 1]

/**
 * Validates that the value is present and has one of the accepted values.
 * This rule is used for checkbox and acceptance field validation.
 *
 * Accepted values are:
 * - "on" (HTML checkbox default when checked)
 * - "1" (string)
 * - "yes" (string)
 * - "true" (string)
 * - true (boolean)
 * - 1 (number)
 *
 * @example
 * vine.accepted()
 *
 * @example
 * vine.string().use(acceptedRule())
 */
export const acceptedRule = createRule(function accepted(value, _, field) {
  if (!ACCEPTED_VALUES.includes(value as any)) {
    field.report(messages.accepted, 'accepted', field)
  }
})
