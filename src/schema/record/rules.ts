/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FieldContext } from '@vinejs/compiler/types'
import { errorMessages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Enforce a minimum length on an object field
 */
export const minLengthRule = createRule<{ min: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length < options.min) {
    ctx.report(errorMessages['record.minLength'], 'minLength', ctx, options)
  }
})

/**
 * Enforce a maximum length on an object field
 */
export const maxLengthRule = createRule<{ max: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length > options.max) {
    ctx.report(errorMessages['record.maxLength'], 'maxLength', ctx, options)
  }
})

/**
 * Enforce a fixed length on an object field
 */
export const fixedLengthRule = createRule<{ size: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an object if the field is valid.
   */
  if (Object.keys(value as Record<string, any>).length !== options.size) {
    ctx.report(errorMessages['record.fixedLength'], 'fixedLength', ctx, options)
  }
})

/**
 * Register a callback to validate the object keys
 */
export const validateKeysRule = createRule<(keys: string[], ctx: FieldContext) => void>(
  (value, callback, ctx) => {
    /**
     * Skip if the field is not valid.
     */
    if (!ctx.isValid) {
      return
    }

    callback(Object.keys(value as Record<string, any>), ctx)
  }
)
