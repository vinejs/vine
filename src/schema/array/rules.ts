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
import { defaultErrorMessages } from '../../error_messages.js'

/**
 * Enforce a minimum length on an array field
 */
export const minLengthRule = createRule<{ expectedLength: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length < options.expectedLength) {
    ctx.report(defaultErrorMessages['array.minLength'], 'minLength', ctx, options)
  }
})

/**
 * Enforce a maximum length on an array field
 */
export const maxLengthRule = createRule<{ expectedLength: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length > options.expectedLength) {
    ctx.report(defaultErrorMessages['array.maxLength'], 'maxLength', ctx, options)
  }
})

/**
 * Enforce a fixed length on an array field
 */
export const fixedLengthRule = createRule<{ expectedLength: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length !== options.expectedLength) {
    ctx.report(defaultErrorMessages['array.fixedLength'], 'fixedLength', ctx, options)
  }
})

/**
 * Ensure the array is not empty
 */
export const notEmptyRule = createRule<undefined>((value, _, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length <= 0) {
    ctx.report(defaultErrorMessages.notEmpty, 'notEmpty', ctx)
  }
})

/**
 * Ensure array elements are distinct/unique
 */
export const distinctRule = createRule<{ fields?: string | string[] }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  const uniqueItems: Set<any> = new Set()

  /**
   * Check for duplicates when no fields are provided
   */
  if (!options.fields) {
    for (let item of value as any[]) {
      if (helpers.exists(item)) {
        if (uniqueItems.has(item)) {
          ctx.report(defaultErrorMessages.distinct, 'distinct', ctx, options)
          return
        } else {
          uniqueItems.add(item)
        }
      }
    }
    return
  }

  /**
   * Checking for duplicates when one or more fields are mentioned
   */
  const fields = Array.isArray(options.fields) ? options.fields : [options.fields]
  for (let item of value as any[]) {
    /**
     * Only process item, if it is not null or undefined
     */
    if (helpers.isObject(item) && helpers.hasKeys(item, fields)) {
      const element = fields.map((field) => item[field]).join('_')

      if (uniqueItems.has(element)) {
        ctx.report(defaultErrorMessages.distinct, 'distinct', ctx, options)
        return
      } else {
        uniqueItems.add(element)
      }
    }
  }
})

/**
 * Removes empty strings, null and undefined values from the array
 */
export const compactRule = createRule<undefined>((value, _, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  ctx.mutate(
    (value as unknown[]).filter((item) => helpers.exists(item) && item !== ''),
    ctx
  )
})
