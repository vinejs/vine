/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../vine/helpers.js'
import { createRule } from '../vine/create_rule.js'
import { defaultErrorMessages } from '../error_messages.js'

export const stringRule = createRule((value, _, ctx) => {
  if (typeof value !== 'string') {
    ctx.report(defaultErrorMessages.string, 'string', ctx)
  }
})

export const booleanRule = createRule((value, _, ctx) => {
  const valueAsBoolean = helpers.asBoolean(value)
  if (valueAsBoolean === null) {
    ctx.report(defaultErrorMessages.boolean, 'boolean', ctx)
    return
  }

  ctx.mutate(valueAsBoolean, ctx)
})

export const equalsRule = createRule<{ expectedValue: any }>((value, { expectedValue }, ctx) => {
  if (typeof expectedValue === 'boolean') {
    if (helpers.asBoolean(value) !== expectedValue) {
      ctx.report(`Expected field value to be "${expectedValue}"`, 'equals', ctx)
    }
  } else if (typeof expectedValue === 'number') {
    if (helpers.asNumber(value) !== expectedValue) {
      ctx.report(`Expected field value to be "${expectedValue}"`, 'equals', ctx)
    }
  } else {
    if (value !== expectedValue) {
      ctx.report(`Expected field value to be "${expectedValue}"`, 'equals', ctx)
    }
  }
})
