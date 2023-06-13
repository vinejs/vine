/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createRule } from '../../vine/create_rule.js'
import { messages } from '../../defaults.js'
import { FieldContext } from '@vinejs/compiler/types'

/**
 * Enum rule is used to validate the field's value to be one
 * from the pre-defined choices.
 */
export const enumRule = createRule<{
  choices: readonly any[] | ((field: FieldContext) => readonly any[])
}>((value, options, field) => {
  const choices = typeof options.choices === 'function' ? options.choices(field) : options.choices

  /**
   * Report error when value is not part of the pre-defined
   * options
   */
  if (!choices.includes(value)) {
    field.report(messages.enum, 'enum', field, { choices })
  }
})
