/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createRule } from '../../vine/create_rule.js'
import { errorMessages } from '../../defaults.js'
import { FieldContext } from '@vinejs/compiler/types'

/**
 * Enum rule is used to validate the field's value to be one
 * from the pre-defined choices.
 */
export const enumRule = createRule<{
  choices: readonly any[] | ((ctx: FieldContext) => readonly any[])
}>((value, options, ctx) => {
  const choices = typeof options.choices === 'function' ? options.choices(ctx) : options.choices

  /**
   * Report error when value is not part of the pre-defined
   * options
   */
  if (!choices.includes(value)) {
    ctx.report(errorMessages.enum, 'enum', ctx, { choices })
  }
})
