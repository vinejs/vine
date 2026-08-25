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
 * Enforce a minimum length on an array field.
 *
 * Validates that an array contains at least the specified number of elements.
 *
 * @example
 * vine.array(vine.string()).minLength(2)
 */
export const minLengthRule = createRule<{ min: number }>(
  function minLength(value, options, field) {
    /**
     * Value will always be an array if the field is valid.
     */
    if ((value as unknown[]).length < options.min) {
      field.report(messages['array.minLength'], 'array.minLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minItems = options.min
    },
  }
)

/**
 * Enforce a maximum length on an array field.
 *
 * Validates that an array contains at most the specified number of elements.
 *
 * @example
 * vine.array(vine.string()).maxLength(10)
 */
export const maxLengthRule = createRule<{ max: number }>(
  function maxLength(value, options, field) {
    /**
     * Value will always be an array if the field is valid.
     */
    if ((value as unknown[]).length > options.max) {
      field.report(messages['array.maxLength'], 'array.maxLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.maxItems = options.max
    },
  }
)

/**
 * Enforce a fixed length on an array field.
 *
 * Validates that an array contains exactly the specified number of elements.
 *
 * @example
 * vine.array(vine.string()).fixedLength(5)
 */
export const fixedLengthRule = createRule<{ size: number }>(
  function fixedLength(value, options, field) {
    /**
     * Value will always be an array if the field is valid.
     */
    if ((value as unknown[]).length !== options.size) {
      field.report(messages['array.fixedLength'], 'array.fixedLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minItems = options.size
      schema.maxItems = options.size
    },
  }
)

/**
 * Ensure the array is not empty.
 *
 * Validates that an array contains at least one element.
 *
 * @example
 * vine.array(vine.string()).notEmpty()
 */
export const notEmptyRule = createRule<undefined>(
  function notEmpty(value, _, field) {
    /**
     * Value will always be an array if the field is valid.
     */
    if ((value as unknown[]).length <= 0) {
      field.report(messages.notEmpty, 'notEmpty', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.minItems = 1
    },
  }
)

/**
 * Ensure array elements are distinct/unique.
 *
 * For primitive arrays, validates that all elements are unique.
 * For object arrays, validates uniqueness based on specified field(s).
 *
 * @example
 * // Validate primitive array uniqueness
 * vine.array(vine.string()).distinct()
 *
 * @example
 * // Validate object array uniqueness by field
 * vine.array(vine.object({ id: vine.number() })).distinct('id')
 *
 * @example
 * // Validate object array uniqueness by multiple fields
 * vine.array(vine.object({
 *   name: vine.string(),
 *   email: vine.string()
 * })).distinct(['name', 'email'])
 */
export const distinctRule = createRule<{ fields?: string | string[] }>(
  function distinct(value, options, field) {
    /**
     * Value will always be an array if the field is valid.
     */
    if (!helpers.isDistinct(value as any[], options.fields)) {
      field.report(messages.distinct, 'distinct', field, options)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.uniqueItems = true
    },
  }
)

/**
 * Removes empty strings, null and undefined values from the array.
 *
 * This rule mutates the array by filtering out falsy values and empty strings.
 * It does not fail validation but transforms the input by removing unwanted values.
 *
 * @example
 * vine.array(vine.string()).compact()
 * // Input: ['a', '', null, 'b', undefined]
 * // Output: ['a', 'b']
 */
export const compactRule = createRule<undefined>(function compact(value, _, field) {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  field.mutate(
    (value as unknown[]).filter((item) => helpers.exists(item) && item !== ''),
    field
  )
})
