/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Verifies two equals are equal considering the HTML forms
 * serialization behavior.
 */
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
