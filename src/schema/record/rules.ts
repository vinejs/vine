/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type FieldContext } from '@vinejs/compiler/types'
import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Enforce a minimum number of properties on a record field.
 *
 * Validates that a record (object) contains at least the specified number of key-value pairs.
 *
 * @example
 * vine.record(vine.string()).minLength(2)
 */
export const minLengthRule = createRule<{ min: number }>(
  function minLength(value, options, field) {
    /**
     * Value will always be an object if the field is valid.
     */
    if (Object.keys(value as Record<string, any>).length < options.min) {
      field.report(messages['record.minLength'], 'record.minLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minProperties = options.min
    },
  }
)

/**
 * Enforce a maximum number of properties on a record field.
 *
 * Validates that a record (object) contains at most the specified number of key-value pairs.
 *
 * @example
 * vine.record(vine.string()).maxLength(10)
 */
export const maxLengthRule = createRule<{ max: number }>(
  function maxLength(value, options, field) {
    /**
     * Value will always be an object if the field is valid.
     */
    if (Object.keys(value as Record<string, any>).length > options.max) {
      field.report(messages['record.maxLength'], 'record.maxLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.maxProperties = options.max
    },
  }
)

/**
 * Enforce an exact number of properties on a record field.
 *
 * Validates that a record (object) contains exactly the specified number of key-value pairs.
 *
 * @example
 * vine.record(vine.string()).fixedLength(5)
 */
export const fixedLengthRule = createRule<{ size: number }>(
  function fixedLength(value, options, field) {
    /**
     * Value will always be an object if the field is valid.
     */
    if (Object.keys(value as Record<string, any>).length !== options.size) {
      field.report(messages['record.fixedLength'], 'record.fixedLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minProperties = options.size
      schema.maxProperties = options.size
    },
  }
)

/**
 * Register a custom callback to validate the record's keys.
 *
 * Allows implementing custom key validation logic, such as checking key patterns,
 * enforcing naming conventions, or validating key existence.
 *
 * @example
 * vine.record(vine.string()).validateKeys((keys, field) => {
 *   // Ensure all keys are lowercase
 *   if (!keys.every(key => key === key.toLowerCase())) {
 *     field.report('All keys must be lowercase', 'invalidKeys', field)
 *   }
 * })
 *
 * @example
 * // Validate that certain keys exist
 * vine.record(vine.string()).validateKeys((keys, field) => {
 *   if (!keys.includes('id')) {
 *     field.report('Record must contain an "id" key', 'missingId', field)
 *   }
 * })
 */
export const validateKeysRule = createRule<(keys: string[], field: FieldContext) => void>(
  function validateKeys(value, callback, field) {
    callback(Object.keys(value as Record<string, any>), field)
  }
)
