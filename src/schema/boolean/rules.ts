/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.js'
import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Validates the value to be a boolean
 */
export const booleanRule = createRule<{ strict?: boolean }>((value, options, ctx) => {
  const valueAsBoolean = options.strict === true ? value : helpers.asBoolean(value)
  if (typeof valueAsBoolean !== 'boolean') {
    ctx.report(messages.boolean, 'boolean', ctx)
    return
  }

  ctx.mutate(valueAsBoolean, ctx)
})
