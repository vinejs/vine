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
import { errorMessages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'
import type { EmailOptions, MobileOptions } from '../../types.js'

/**
 * Validates the value to be a string
 */
export const stringRule = createRule((value, _, ctx) => {
  if (typeof value !== 'string') {
    ctx.report(errorMessages.string, 'string', ctx)
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
    ctx.report(errorMessages.email, 'email', ctx)
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
    ctx.report(errorMessages.mobile, 'mobile', ctx)
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
    ctx.report(errorMessages.hexCode, 'hexCode', ctx)
  }
})
