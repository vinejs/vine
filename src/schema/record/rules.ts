/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FieldContext } from '@vinejs/compiler/types'
import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Enforce a minimum length on an object field
 */
export const minLengthRule = createRule<{ min: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length < options.min) {
    field.report(messages['record.minLength'], 'minLength', field, options)
  }
})

/**
 * Enforce a maximum length on an object field
 */
export const maxLengthRule = createRule<{ max: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length > options.max) {
    field.report(messages['record.maxLength'], 'maxLength', field, options)
  }
})

/**
 * Enforce a fixed length on an object field
 */
export const fixedLengthRule = createRule<{ size: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length !== options.size) {
    field.report(messages['record.fixedLength'], 'fixedLength', field, options)
  }
})

/**
 * Register a callback to validate the object keys
 */
export const validateKeysRule = createRule<(keys: string[], field: FieldContext) => void>(
  (value, callback, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    callback(Object.keys(value as Record<string, any>), field)
  }
)
