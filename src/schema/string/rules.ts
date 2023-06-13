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
export const stringRule = createRule((value, _, field) => {
  if (typeof value !== 'string') {
    field.report(messages.string, 'string', field)
  }
})

/**
 * Validates the value to be a valid email address
 */
export const emailRule = createRule<EmailOptions | undefined>((value, options, field) => {
  if (!field.isValid) {
    return
  }

  if (!helpers.isEmail(value as string, options)) {
    field.report(messages.email, 'email', field)
  }
})

/**
 * Validates the value to be a valid mobile number
 */
export const mobileRule = createRule<
  MobileOptions | undefined | ((field: FieldContext) => MobileOptions | undefined)
>((value, options, field) => {
  if (!field.isValid) {
    return
  }

  const normalizedOptions = options && typeof options === 'function' ? options(field) : options
  const locales = normalizedOptions?.locales || 'any'

  if (!helpers.isMobilePhone(value as string, locales, normalizedOptions)) {
    field.report(messages.mobile, 'mobile', field)
  }
})

/**
 * Validates the value to be a valid hex color code
 */
export const hexCodeRule = createRule((value, _, field) => {
  if (!field.isValid) {
    return
  }

  if (!helpers.isHexColor(value as string)) {
    field.report(messages.hexCode, 'hexCode', field)
  }
})

/**
 * Validates the value to be a valid URL
 */
export const urlRule = createRule<URLOptions | undefined>((value, options, field) => {
  if (!field.isValid) {
    return
  }

  if (!helpers.isURL(value as string, options)) {
    field.report(messages.url, 'url', field)
  }
})
