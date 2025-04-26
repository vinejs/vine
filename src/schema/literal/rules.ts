/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { messages } from '../../defaults.js'
import { helpers } from '../../vine/helpers.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Verifies two equals are equal considering the HTML forms
 * serialization behavior.
 */
export const equalsRule = createRule<{ expectedValue: any }>(
  function equals(value, options, field) {
    const comparedValue = helpers.compareValues(value, options.expectedValue)

    /**
     * Performing validation and reporting error
     */
    if (!comparedValue.isEqual) {
      field.report(messages.literal, 'literal', field, options)
      return
    }

    /**
     * Mutating input with normalized value
     */
    field.mutate(comparedValue.casted, field)
  }
)
