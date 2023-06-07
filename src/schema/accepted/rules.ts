/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { errorMessages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

const ACCEPTED_VALUES = ['on', '1', 'yes', 'true', true, 1]

/**
 * Validates the value to be present and have one of
 * the following values.
 *
 * - "on"
 * - "1"
 * - "yes"
 * - "true"
 */
export const acceptedRule = createRule((value, _, ctx) => {
  if (!ACCEPTED_VALUES.includes(value as any)) {
    ctx.report(errorMessages.accepted, 'accepted', ctx)
  }
})
