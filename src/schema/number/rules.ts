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
import { messages } from '../../defaults.js'

/**
 * Enforce the value to be a number or a string representation
 * of a number
 */
export const numberRule = createRule((value, _, ctx) => {
  const valueAsNumber = helpers.asNumber(value)
  if (
    Number.isNaN(valueAsNumber) ||
    valueAsNumber === Number.POSITIVE_INFINITY ||
    valueAsNumber === Number.NEGATIVE_INFINITY
  ) {
    ctx.report(messages.number, 'number', ctx)
    return
  }

  ctx.mutate(valueAsNumber, ctx)
})

/**
 * Enforce a minimum value on a number field
 */
export const minRule = createRule<{ min: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if ((value as number) < options.min) {
    ctx.report(messages.min, 'min', ctx, options)
  }
})

/**
 * Enforce a maximum value on a number field
 */
export const maxRule = createRule<{ max: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if ((value as number) > options.max) {
    ctx.report(messages.max, 'max', ctx, options)
  }
})

/**
 * Enforce a range of values on a number field.
 */
export const rangeRule = createRule<{ min: number; max: number }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if ((value as number) < options.min || (value as number) > options.max) {
    ctx.report(messages.range, 'range', ctx, options)
  }
})

/**
 * Enforce the value is a positive number
 */
export const positiveRule = createRule((value, _, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if ((value as number) < 0) {
    ctx.report(messages.positive, 'positive', ctx)
  }
})

/**
 * Enforce the value is a negative number
 */
export const negativeRule = createRule<undefined>((value, _, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if ((value as number) >= 0) {
    ctx.report(messages.negative, 'negative', ctx)
  }
})

/**
 * Enforce the value to have a fixed or range of decimals
 */
export const decimalRule = createRule<{ range: [number, number?] }>((value, options, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if (
    !helpers.isDecimal(String(value), {
      force_decimal: options.range[0] !== 0,
      decimal_digits: options.range.join(','),
    })
  ) {
    ctx.report(messages.decimal, 'decimal', ctx, { digits: options.range.join('-') })
  }
})

/**
 * Enforce the value to not have decimal places
 */
export const withoutDecimalsRule = createRule((value, _, ctx) => {
  /**
   * Skip if the field is not valid.
   */
  if (!ctx.isValid) {
    return
  }

  if (!Number.isInteger(value)) {
    ctx.report(messages.withoutDecimals, 'withoutDecimals', ctx)
  }
})
