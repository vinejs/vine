/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FieldContext } from '@vinejs/compiler/types'

import { helpers } from '../../vine/helpers.js'
import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'
import type { EmailOptions, MobileOptions, URLOptions } from '../../types.js'

/**
 * Validates the value to be a string
 */
export const stringRule = createRule((value, _, ctx) => {
  if (typeof value !== 'string') {
    ctx.report(messages.string, 'string', ctx)
  }
})

/**
 * Validates the value to be a valid email address
 */
export const emailRule = createRule<EmailOptions | undefined>((value, options, ctx) => {
  if (!ctx.isValid) {
    return
  }

  if (!helpers.isEmail(value as string, options)) {
    ctx.report(messages.email, 'email', ctx)
  }
})

/**
 * Validates the value to be a valid mobile number
 */
export const mobileRule = createRule<
  MobileOptions | undefined | ((ctx: FieldContext) => MobileOptions | undefined)
>((value, options, ctx) => {
  if (!ctx.isValid) {
    return
  }

  const normalizedOptions = options && typeof options === 'function' ? options(ctx) : options
  const locales = normalizedOptions?.locales || 'any'

  if (!helpers.isMobilePhone(value as string, locales, normalizedOptions)) {
    ctx.report(messages.mobile, 'mobile', ctx)
  }
})

/**
 * Validates the value to be a valid hex color code
 */
export const hexCodeRule = createRule((value, _, ctx) => {
  if (!ctx.isValid) {
    return
  }

  if (!helpers.isHexColor(value as string)) {
    ctx.report(messages.hexCode, 'hexCode', ctx)
  }
})

/**
 * Validates the value to be a valid URL
 */
export const urlRule = createRule<URLOptions | undefined>((value, options, ctx) => {
  if (!ctx.isValid) {
    return
  }

  if (!helpers.isURL(value as string, options)) {
    ctx.report(messages.url, 'url', ctx)
  }
})
