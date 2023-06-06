/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createRule } from '../vine/create_rule.js'
import { defaultErrorMessages } from '../error_messages.js'

/**
 * Enum rule is used to validate the field's value to be one
 * from the pre-defined choices.
 */
export const enumRule = createRule<{ choices: readonly any[] }>((value, options, ctx) => {
  /**
   * Report error when value is not part of the pre-defined
   * options
   */
  if (!options.choices.includes(value)) {
    ctx.report(defaultErrorMessages.enum, 'enum', ctx, options)
  }
})
