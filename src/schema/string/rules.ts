/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import validator from 'validator'
import type { FieldContext } from '@vinejs/compiler/types'

import { helpers } from '../../vine/helpers.js'
import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'
import type {
  URLOptions,
  AlphaOptions,
  EmailOptions,
  MobileOptions,
  AlphaNumericOptions,
  NormalizeEmailOptions,
} from '../../types.js'

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
 * Validates the value against a regular expression
 */
export const regexRule = createRule<RegExp>((value, expression, field) => {
  if (!field.isValid) {
    return
  }

  if (!expression.test(value as string)) {
    field.report(messages.regex, 'regex', field)
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

/**
 * Validates the value to be an active URL
 */
export const activeUrlRule = createRule(async (value, _, field) => {
  if (!field.isValid) {
    return
  }

  if (!(await helpers.isActiveURL(value as string))) {
    field.report(messages.activeUrl, 'activeUrl', field)
  }
})

/**
 * Validates the value to contain only letters
 */
export const alphaRule = createRule<AlphaOptions | undefined>((value, options, field) => {
  if (!field.isValid) {
    return
  }

  let characterSet = 'a-zA-Z'
  if (options) {
    if (options.allowSpaces) {
      characterSet += '\\s'
    }
    if (options.allowDashes) {
      characterSet += '-'
    }
    if (options.allowUnderscores) {
      characterSet += '_'
    }
  }

  const expression = new RegExp(`^[${characterSet}]+$`)
  if (!expression.test(value as string)) {
    field.report(messages.alpha, 'alpha', field)
  }
})

/**
 * Validates the value to contain only letters and numbers
 */
export const alphaNumericRule = createRule<AlphaNumericOptions | undefined>(
  (value, options, field) => {
    if (!field.isValid) {
      return
    }

    let characterSet = 'a-zA-Z0-9'
    if (options) {
      if (options.allowSpaces) {
        characterSet += '\\s'
      }
      if (options.allowDashes) {
        characterSet += '-'
      }
      if (options.allowUnderscores) {
        characterSet += '_'
      }
    }

    const expression = new RegExp(`^[${characterSet}]+$`)
    if (!expression.test(value as string)) {
      field.report(messages.alphaNumeric, 'alphaNumeric', field)
    }
  }
)

/**
 * Enforce a minimum length on a string field
 */
export const minLengthRule = createRule<{ min: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }
  if ((value as string).length < options.min) {
    field.report(messages.minLength, 'minLength', field, options)
  }
})

/**
 * Enforce a maximum length on a string field
 */
export const maxLengthRule = createRule<{ max: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  if ((value as string).length > options.max) {
    field.report(messages.maxLength, 'maxLength', field, options)
  }
})

/**
 * Enforce a fixed length on a string field
 */
export const fixedLengthRule = createRule<{ size: number }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  if ((value as string).length !== options.size) {
    field.report(messages.fixedLength, 'fixedLength', field, options)
  }
})

/**
 * Ensure the value ends with the pre-defined substring
 */
export const endsWithRule = createRule<{ substring: string }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  if (!(value as string).endsWith(options.substring)) {
    field.report(messages.endsWith, 'endsWith', field, options)
  }
})

/**
 * Ensure the value starts with the pre-defined substring
 */
export const startsWithRule = createRule<{ substring: string }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  if (!(value as string).startsWith(options.substring)) {
    field.report(messages.startsWith, 'startsWith', field, options)
  }
})

/**
 * Ensure the field's value under validation is the same as the other field's value
 */
export const sameAsRule = createRule<{ otherField: string }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  const input = field.parent[options.otherField]

  /**
   * Performing validation and reporting error
   */
  if (input !== value) {
    field.report(messages.sameAs, 'sameAs', field, options)
    return
  }
})

/**
 * Ensure the field's value under validation is different from another field's value
 */
export const notSameAsRule = createRule<{ otherField: string }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  const input = field.parent[options.otherField]

  /**
   * Performing validation and reporting error
   */
  if (input === value) {
    field.report(messages.notSameAs, 'notSameAs', field, options)
    return
  }
})

/**
 * Ensure the field under validation is confirmed by
 * having another field with the same name
 */
export const confirmedRule = createRule<{ confirmationField: string } | undefined>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    const otherField = options?.confirmationField || `${field.name}_confirmation`
    const input = field.parent[otherField]

    /**
     * Performing validation and reporting error
     */
    if (input !== value) {
      field.report(messages.confirmed, 'confirmed', field, { otherField })
      return
    }
  }
)

/**
 * Trims whitespaces around the string value
 */
export const trimRule = createRule((value, _, field) => {
  if (!field.isValid) {
    return
  }

  field.mutate((value as string).trim(), field)
})

/**
 * Normalizes the email address
 */
export const normalizeEmailRule = createRule<NormalizeEmailOptions | undefined>(
  (value, options, field) => {
    if (!field.isValid) {
      return
    }

    field.mutate(validator.default.normalizeEmail(value as string, options), field)
  }
)

/**
 * Ensure the field's value under validation is a subset of the pre-defined list.
 */
export const inRule = createRule<{ choices: string[] | ((field: FieldContext) => string[]) }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    const choices = typeof options.choices === 'function' ? options.choices(field) : options.choices

    /**
     * Performing validation and reporting error
     */
    if (!choices.includes(value as string)) {
      field.report(messages.in, 'in', field, options)
      return
    }
  }
)

/**
 * Ensure the field's value under validation is not inside the pre-defined list.
 */
export const notInRule = createRule<{ list: string[] | ((field: FieldContext) => string[]) }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    const list = typeof options.list === 'function' ? options.list(field) : options.list

    /**
     * Performing validation and reporting error
     */
    if (list.includes(value as string)) {
      field.report(messages.notIn, 'notIn', field, options)
      return
    }
  }
)
