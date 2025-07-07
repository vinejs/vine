/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import normalizeUrl from 'normalize-url'
import escapeValue from 'validator/lib/escape.js'
import type { FieldContext } from '@vinejs/compiler/types'
import normalizeEmailValue from 'validator/lib/normalizeEmail.js'

import { messages } from '../../defaults.js'
import { helpers } from '../../vine/helpers.js'
import { createRule } from '../../vine/create_rule.js'
import type {
  URLOptions,
  AlphaOptions,
  EmailOptions,
  MobileOptions,
  PassportOptions,
  CreditCardOptions,
  PostalCodeOptions,
  NormalizeUrlOptions,
  AlphaNumericOptions,
  NormalizeEmailOptions,
} from '../../types.js'

/**
 * Validates the value to be a string
 */
export const stringRule = createRule(
  function string(value, _, field) {
    if (!field.isDefined) {
      return false
    }

    if (typeof value === 'string') {
      return true
    }

    field.report(messages.string, 'string', field)
    return false
  },
  {
    toJSONSchema: (schema) => {
      schema.type = 'string'
    },
  }
)

/**
 * Validates the value to be a valid email address
 */
export const emailRule = createRule<EmailOptions | undefined>(
  function email(value, options, field) {
    if (!helpers.isEmail(value as string, options)) {
      field.report(messages.email, 'email', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.format = 'email'
    },
  }
)

/**
 * Validates the value to be a valid mobile number
 */
export const mobileRule = createRule<
  MobileOptions | undefined | ((field: FieldContext) => MobileOptions | undefined)
>(function mobile(value, options, field) {
  const normalizedOptions = options && typeof options === 'function' ? options(field) : options
  const locales = normalizedOptions?.locale || 'any'

  if (!helpers.isMobilePhone(value as string, locales, normalizedOptions)) {
    field.report(messages.mobile, 'mobile', field)
  }
})

/**
 * Validates the value to be a valid IP address.
 */
export const ipAddressRule = createRule<{ version: 4 | 6 } | undefined>(
  function ipAddress(value, options, field) {
    if (!helpers.isIP(value as string, options?.version)) {
      field.report(messages.ipAddress, 'ipAddress', field)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.format = options?.version === 6 ? 'ipv6' : 'ipv4'
    },
  }
)

/**
 * Validates the value against a regular expression
 */
export const regexRule = createRule<RegExp>(
  function regex(value, expression, field) {
    if (!expression.test(value as string)) {
      field.report(messages.regex, 'regex', field)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.pattern = options.source
    },
  }
)

/**
 * Validates the value to be a valid hex color code
 */
export const hexCodeRule = createRule(
  function hexCode(value, _, field) {
    if (!helpers.isHexColor(value as string)) {
      field.report(messages.hexCode, 'hexCode', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.pattern = '^#?([0-9a-f]{6}|[0-9a-f]{3}|[0-9a-f]{8})$'
    },
  }
)

/**
 * Validates the value to be a valid URL
 */
export const urlRule = createRule<URLOptions | undefined>(
  function url(value, options, field) {
    if (!helpers.isURL(value as string, options)) {
      field.report(messages.url, 'url', field)
      field.report(messages.url, 'url', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.format = 'uri'
    },
  }
)

/**
 * Validates the value to be an active URL
 */
export const activeUrlRule = createRule(async function activeUrl(value, _, field) {
  if (!(await helpers.isActiveURL(value as string))) {
    field.report(messages.activeUrl, 'activeUrl', field)
  }
})

/**
 * Validates the value to contain only letters
 */
export const alphaRule = createRule<AlphaOptions | undefined>(
  function alpha(value, options, field) {
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
  },
  {
    toJSONSchema: (schema, options) => {
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

      schema.pattern = `^[${characterSet}]+$`
    },
  }
)

/**
 * Validates the value to contain only letters and numbers
 */
export const alphaNumericRule = createRule<AlphaNumericOptions | undefined>(
  function alphaNumeric(value, options, field) {
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
  },
  {
    toJSONSchema: (schema, options) => {
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

      schema.pattern = `^[${characterSet}]+$`
    },
  }
)

/**
 * Enforce a minimum length on a string field
 */
export const minLengthRule = createRule<{ min: number }>(
  function minLength(value, options, field) {
    if ((value as string).length < options.min) {
      field.report(messages.minLength, 'minLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minLength = options.min
    },
  }
)

/**
 * Enforce a maximum length on a string field
 */
export const maxLengthRule = createRule<{ max: number }>(
  function maxLength(value, options, field) {
    if ((value as string).length > options.max) {
      field.report(messages.maxLength, 'maxLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.maxLength = options.max
    },
  }
)

/**
 * Enforce a fixed length on a string field
 */
export const fixedLengthRule = createRule<{ size: number }>(
  function fixedLength(value, options, field) {
    if ((value as string).length !== options.size) {
      field.report(messages.fixedLength, 'fixedLength', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minLength = options.size
      schema.maxLength = options.size
    },
  }
)

/**
 * Ensure the value ends with the pre-defined substring
 */
export const endsWithRule = createRule<{ substring: string }>(
  function endsWith(value, options, field) {
    if (!(value as string).endsWith(options.substring)) {
      field.report(messages.endsWith, 'endsWith', field, options)
    }
  }
)

/**
 * Ensure the value starts with the pre-defined substring
 */
export const startsWithRule = createRule<{ substring: string }>(
  function startsWith(value, options, field) {
    if (!(value as string).startsWith(options.substring)) {
      field.report(messages.startsWith, 'startsWith', field, options)
    }
  }
)

/**
 * Ensure the field's value under validation is the same as the other field's value
 */
export const sameAsRule = createRule<{ otherField: string }>(
  function sameAs(value, options, field) {
    const input = helpers.getNestedValue(options.otherField, field)

    /**
     * Performing validation and reporting error
     */
    if (input !== value) {
      field.report(messages.sameAs, 'sameAs', field, options)
      return
    }
  }
)

/**
 * Ensure the field's value under validation is different from another field's value
 */
export const notSameAsRule = createRule<{ otherField: string }>(
  function notSameAs(value, options, field) {
    const input = helpers.getNestedValue(options.otherField, field)

    /**
     * Performing validation and reporting error
     */
    if (input === value) {
      field.report(messages.notSameAs, 'notSameAs', field, options)
      return
    }
  }
)

/**
 * Ensure the field under validation is confirmed by
 * having another field with the same name
 */
export const confirmedRule = createRule<{ confirmationField: string } | undefined>(
  function confirmed(value, options, field) {
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
 * Ensure the field's value under validation is a subset of the pre-defined list.
 */
export const inRule = createRule<{ choices: string[] | ((field: FieldContext) => string[]) }>(
  function inList(value, options, field) {
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
  function notIn(value, options, field) {
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

/**
 * Validates the value to be a valid credit card number
 */
export const creditCardRule = createRule<
  CreditCardOptions | undefined | ((field: FieldContext) => CreditCardOptions | void | undefined)
>(function creditCard(value, options, field) {
  const providers = options
    ? typeof options === 'function'
      ? options(field)?.provider || []
      : options.provider
    : []

  if (!providers.length) {
    if (!helpers.isCreditCard(value as string)) {
      field.report(messages.creditCard, 'creditCard', field, {
        providersList: 'credit',
      })
    }
  } else {
    const matchesAnyProvider = providers.find((provider) =>
      helpers.isCreditCard(value as string, { provider })
    )

    if (!matchesAnyProvider) {
      field.report(messages.creditCard, 'creditCard', field, {
        providers: providers,
        providersList: providers.join('/'),
      })
    }
  }
})

/**
 * Validates the value to be a valid passport number
 */
export const passportRule = createRule<
  PassportOptions | ((field: FieldContext) => PassportOptions)
>(function passport(value, options, field) {
  const countryCodes =
    typeof options === 'function' ? options(field).countryCode : options.countryCode

  const matchesAnyCountryCode = countryCodes.find((countryCode) =>
    helpers.isPassportNumber(value as string, countryCode)
  )
  if (!matchesAnyCountryCode) {
    field.report(messages.passport, 'passport', field, { countryCodes })
  }
})

/**
 * Validates the value to be a valid postal code
 */
export const postalCodeRule = createRule<
  PostalCodeOptions | undefined | ((field: FieldContext) => PostalCodeOptions | void | undefined)
>(function postalCode(value, options, field) {
  const countryCodes = options
    ? typeof options === 'function'
      ? options(field)?.countryCode || []
      : options.countryCode
    : []

  if (!countryCodes.length) {
    if (!helpers.isPostalCode(value as string, 'any')) {
      field.report(messages.postalCode, 'postalCode', field)
    }
  } else {
    const matchesAnyCountryCode = countryCodes.find((countryCode) =>
      helpers.isPostalCode(value as string, countryCode)
    )
    if (!matchesAnyCountryCode) {
      field.report(messages.postalCode, 'postalCode', field, { countryCodes })
    }
  }
})

/**
 * Validates the value to be a valid UUID
 */
export const uuidRule = createRule<{ version?: (1 | 2 | 3 | 4 | 5)[] } | undefined>(
  function uuid(value, options, field) {
    if (!options || !options.version) {
      if (!helpers.isUUID(value as string)) {
        field.report(messages.uuid, 'uuid', field)
      }
    } else {
      const matchesAnyVersion = options.version.find((version) =>
        helpers.isUUID(value as string, version)
      )
      if (!matchesAnyVersion) {
        field.report(messages.uuid, 'uuid', field, options)
      }
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.format = 'uuid'
    },
  }
)

/**
 * Validates the value to be a valid ULID
 */
export const ulidRule = createRule(
  function ulid(value, _, field) {
    if (!helpers.isULID(value as string)) {
      field.report(messages.ulid, 'ulid', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.pattern = '^[0-7][0-9A-HJKMNP-TV-Z]{25}$'
    },
  }
)

/**
 * Validates the value contains ASCII characters only
 */
export const asciiRule = createRule(function ascii(value, _, field) {
  if (!helpers.isAscii(value as string)) {
    field.report(messages.ascii, 'ascii', field)
  }
})

/**
 * Validates the value to be a valid IBAN number
 */
export const ibanRule = createRule(function iban(value, _, field) {
  if (!helpers.isIBAN(value as string)) {
    field.report(messages.iban, 'iban', field)
  }
})

/**
 * Validates the value to be a valid JWT token
 */
export const jwtRule = createRule(function jwt(value, _, field) {
  if (!helpers.isJWT(value as string)) {
    field.report(messages.jwt, 'jwt', field)
  }
})

/**
 * Ensure the value is a string with latitude and longitude coordinates
 */
export const coordinatesRule = createRule(function coordinates(value, _, field) {
  if (!helpers.isLatLong(value as string)) {
    field.report(messages.coordinates, 'coordinates', field)
  }
})

/**
 * Trims whitespaces around the string value
 */
export const trimRule = createRule(function trim(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate((value as string).trim(), field)
})

/**
 * Normalizes the email address
 */
export const normalizeEmailRule = createRule<NormalizeEmailOptions | undefined>(
  function normalizeEmail(value, options, field) {
    if (!field.isValid) {
      return
    }

    field.mutate(normalizeEmailValue.default(value as string, options), field)
  }
)

/**
 * Converts the field value to UPPERCASE.
 */
export const toUpperCaseRule = createRule<string | string[] | undefined>(
  function toUpperCase(value, locales, field) {
    if (!field.isValid) {
      return
    }

    field.mutate((value as string).toLocaleUpperCase(locales), field)
  }
)

/**
 * Converts the field value to lowercase.
 */
export const toLowerCaseRule = createRule<string | string[] | undefined>(
  function toLowerCase(value, locales, field) {
    if (!field.isValid) {
      return
    }

    field.mutate((value as string).toLocaleLowerCase(locales), field)
  }
)

/**
 * Converts the field value to camelCase.
 */
export const toCamelCaseRule = createRule(function toCamelCase(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate(camelcase(value as string), field)
})

/**
 * Escape string for HTML entities
 */
export const escapeRule = createRule(function escape(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate(escapeValue.default(value as string), field)
})

/**
 * Normalize a URL
 */
export const normalizeUrlRule = createRule<undefined | NormalizeUrlOptions>(
  function normalizeUrlValue(value, options, field) {
    if (!field.isValid) {
      return
    }

    field.mutate(normalizeUrl(value as string, options), field)
  }
)
