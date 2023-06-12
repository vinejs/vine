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
 * Enforce a minimum length on an array field
 */
export const minLengthRule = createRule<{ min: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length < options.min) {
    ctx.report(messages['array.minLength'], 'minLength', ctx, options)
  }
})

/**
 * Enforce a maximum length on an array field
 */
export const maxLengthRule = createRule<{ max: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length > options.max) {
    ctx.report(messages['array.maxLength'], 'maxLength', ctx, options)
  }
})

/**
 * Enforce a fixed length on an array field
 */
export const fixedLengthRule = createRule<{ size: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  /**
   * Value will always be an array if the field is valid.
   */
  if ((value as unknown[]).length !== options.size) {
    ctx.report(messages['array.fixedLength'], 'fixedLength', ctx, options)
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
    ctx.report(messages.notEmpty, 'notEmpty', ctx)
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

  /**
   * Value will always be an array if the field is valid.
   */
  if (!helpers.isDistinct(value as any[], options.fields)) {
    ctx.report(messages.distinct, 'distinct', ctx, options)
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
