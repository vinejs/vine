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
 * Verifies two equals are equal considering the HTML forms
 * serialization behavior.
 */
export const equalsRule = createRule<{ expectedValue: any }>((value, options, ctx) => {
  let input = value

  /**
   * Normalizing the field value as per the expected
   * value.
   */
  if (typeof options.expectedValue === 'boolean') {
    input = helpers.asBoolean(value)
  } else if (typeof options.expectedValue === 'number') {
    input = helpers.asNumber(value)
  }

  /**
   * Performing validation and reporting error
   */
  if (input !== options.expectedValue) {
    ctx.report(errorMessages.literal, 'literal', ctx, options)
    return
  }

  /**
   * Mutating input with normalized value
   */
  ctx.mutate(input, ctx)
})
