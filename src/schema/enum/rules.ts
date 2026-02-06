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
import { type FieldContext } from '@vinejs/compiler/types'

/**
 * Enum rule validates that a field's value is one of the pre-defined choices.
 *
 * The choices can be provided as a static array or as a function that returns
 * an array, allowing for dynamic choice lists based on the field context.
 *
 * @example
 * vine.string().use(enumRule({ choices: ['red', 'blue', 'green'] }))
 *
 * @example
 * vine.string().use(enumRule({
 *   choices: (field) => field.data.availableColors
 * }))
 */
export const enumRule = createRule<{
  choices: readonly any[] | ((field: FieldContext) => readonly any[])
}>(
  function enumList(value, options, field) {
    const choices = typeof options.choices === 'function' ? options.choices(field) : options.choices

    /**
     * Report error when value is not part of the pre-defined
     * options
     */
    if (!choices.includes(value)) {
      field.report(messages.enum, 'enum', field, { choices })
    }
  },
  {
    // TODO: We might want to handle this differently
    toJSONSchema: (schema, options) => {
      if (typeof options.choices === 'function') return
      schema.enum = options.choices as any[]
    },
  }
)
