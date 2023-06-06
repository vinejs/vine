/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.js'
import { errorMessages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Validates the value to be a boolean
 */
export const booleanRule = createRule((value, _, ctx) => {
  const valueAsBoolean = helpers.asBoolean(value)
  if (valueAsBoolean === null) {
    ctx.report(errorMessages.boolean, 'boolean', ctx)
    return
  }

  ctx.mutate(valueAsBoolean, ctx)
})
