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
  VATOptions,
} from '../../types.js'

/**
 * Validates the value to be a string.
 * Reports an error if the value is not of type string.
 *
 * @example
 * vine.string()
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
 * Validates the value to be a valid email address.
 * Supports various email validation options including domain-specific rules.
 *
 * @example
 * vine.string().email()
 * vine.string().email({ allow_ip_domain: true })
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
 * Validates the value to be a valid mobile phone number for specified locales.
 * Supports locale-specific mobile number formats and strict mode validation.
 *
 * @example
 * vine.string().mobile()
 * vine.string().mobile({ locale: ['en-US', 'en-GB'] })
 * vine.string().mobile({ locale: ['en-US'], strictMode: true })
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
 * Validates the value to be a valid IP address (IPv4 or IPv6).
 * Optionally restricts to a specific IP version.
 *
 * @example
 * vine.string().ipAddress()
 * vine.string().ipAddress({ version: 4 })
 * vine.string().ipAddress({ version: 6 })
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
 * Validates the value against a custom regular expression pattern.
 * The value must match the provided regular expression.
 *
 * @example
 * vine.string().regex(/^[A-Z]{3}\d{3}$/)
 * vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)
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
 * Validates the value to be a valid hexadecimal color code.
 * Accepts formats like #FFF, #FFFFFF, or #FFFFFFFF.
 *
 * @example
 * vine.string().hexCode()
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
 * Validates the value to be a valid URL.
 * Supports various URL validation options including protocol requirements.
 *
 * @example
 * vine.string().url()
 * vine.string().url({ require_protocol: true })
 * vine.string().url({ protocols: ['https'] })
 */
export const urlRule = createRule<URLOptions | undefined>(
  function url(value, options, field) {
    if (!helpers.isURL(value as string, options)) {
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
 * Validates the value to be an active URL by making an HTTP request.
 * Checks if the URL is reachable and returns a successful response.
 *
 * @example
 * vine.string().activeUrl()
 */
export const activeUrlRule = createRule(async function activeUrl(value, _, field) {
  if (!(await helpers.isActiveURL(value as string))) {
    field.report(messages.activeUrl, 'activeUrl', field)
  }
})

/**
 * Validates the value to contain only alphabetic characters.
 * Supports options to allow spaces, dashes, and underscores.
 *
 * @example
 * vine.string().alpha()
 * vine.string().alpha({ allowSpaces: true })
 * vine.string().alpha({ allowDashes: true, allowUnderscores: true })
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
 * Validates the value to contain only alphanumeric characters (letters and numbers).
 * Supports options to allow spaces, dashes, and underscores.
 *
 * @example
 * vine.string().alphaNumeric()
 * vine.string().alphaNumeric({ allowSpaces: true })
 * vine.string().alphaNumeric({ allowDashes: true, allowUnderscores: true })
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
 * Enforces a minimum length on a string field.
 * The string must have at least the specified number of characters.
 *
 * @example
 * vine.string().minLength(5)
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
 * Enforces a maximum length on a string field.
 * The string must not exceed the specified number of characters.
 *
 * @example
 * vine.string().maxLength(100)
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
 * Enforces a fixed length on a string field.
 * The string must have exactly the specified number of characters.
 *
 * @example
 * vine.string().fixedLength(10)
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
 * Ensures the value ends with the specified substring.
 * The comparison is case-sensitive.
 *
 * @example
 * vine.string().endsWith('.com')
 * vine.string().endsWith('_test')
 */
export const endsWithRule = createRule<{ substring: string }>(
  function endsWith(value, options, field) {
    if (!(value as string).endsWith(options.substring)) {
      field.report(messages.endsWith, 'endsWith', field, options)
    }
  }
)

/**
 * Ensures the value starts with the specified substring.
 * The comparison is case-sensitive.
 *
 * @example
 * vine.string().startsWith('https://')
 * vine.string().startsWith('prefix_')
 */
export const startsWithRule = createRule<{ substring: string }>(
  function startsWith(value, options, field) {
    if (!(value as string).startsWith(options.substring)) {
      field.report(messages.startsWith, 'startsWith', field, options)
    }
  }
)

/**
 * Ensures the field's value under validation is the same as the other field's value.
 * Useful for confirmation fields like password verification.
 *
 * @example
 * vine.string().sameAs('password')
 * vine.string().sameAs('email')
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
 * Ensures the field's value under validation is different from another field's value.
 * Useful for ensuring new values differ from old ones (e.g., new password vs old password).
 *
 * @example
 * vine.string().notSameAs('oldPassword')
 * vine.string().notSameAs('previousEmail')
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
 * Ensures the field under validation is confirmed by having another field with the same name
 * (with "_confirmation" suffix by default). The values of both fields must match.
 *
 * @example
 * vine.string().confirmed()
 * vine.string().confirmed({ as: 'passwordConfirm' })
 */
export const confirmedRule = createRule<
  | {
      /**
       * @deprecated
       * Use "as" field instead
       */
      confirmationField?: string
    }
  | {
      as?: string
    }
  | undefined
>(function confirmed(value, options, field) {
  const normalizedOptions: { confirmationField?: string; as?: string } = options ?? {}
  const otherField =
    normalizedOptions.as ?? normalizedOptions.confirmationField ?? `${field.name}_confirmation`
  const input = field.parent[otherField]

  /**
   * Performing validation and reporting error
   */
  if (input !== value) {
    field.report(
      messages.confirmed,
      'confirmed',
      {
        ...field,
        name: otherField,
        wildCardPath: `${field.wildCardPath.replace(String(field.name), otherField)}`,
        isDefined: true,
        isValid: false,
        value: input,
        getFieldPath() {
          const parentPath = field.getFieldPath()
          return `${parentPath.replace(String(field.name), otherField)}`
        },
      },
      { otherField, originalField: field.name }
    )
    return
  }
})

/**
 * Ensures the field's value under validation is one of the pre-defined choices.
 * Accepts a static array of choices or a function that returns choices dynamically.
 *
 * @example
 * vine.string().in(['red', 'green', 'blue'])
 * vine.string().in((field) => getUserRoles(field.meta.userId))
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
 * Ensures the field's value under validation is not in the pre-defined list.
 * Accepts a static array or a function that returns disallowed values dynamically.
 *
 * @example
 * vine.string().notIn(['admin', 'root', 'system'])
 * vine.string().notIn((field) => getBlacklistedUsernames())
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
 * Validates the value to be a valid credit card number.
 * Optionally restricts validation to specific card providers.
 *
 * @example
 * vine.string().creditCard()
 * vine.string().creditCard({ provider: ['visa', 'mastercard'] })
 * vine.string().creditCard({ provider: ['amex', 'discover'] })
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
 * Validates the value to be a valid passport number for specified countries.
 * Requires country codes to determine the expected passport format.
 *
 * @example
 * vine.string().passport({ countryCode: ['US', 'GB', 'CA'] })
 * vine.string().passport({ countryCode: ['FR', 'DE'] })
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
 * Validates the value to be a valid VAT (Value Added Tax) number for specified countries.
 * Requires country codes to determine the expected VAT format.
 *
 * @example
 * vine.string().vat({ countryCode: ['FR', 'CH', 'VE'] })
 * vine.string().vat({ countryCode: ['GB', 'DE'] })
 */
export const vatRule = createRule<VATOptions | ((field: FieldContext) => VATOptions)>(
  function vat(value, options, field) {
    const countryCodes =
      typeof options === 'function' ? options(field).countryCode : options.countryCode

    const matchesAnyCountryCode = countryCodes.find((countryCode) =>
      helpers.isVAT(value as string, countryCode)
    )
    if (!matchesAnyCountryCode) {
      field.report(messages.vat, 'vat', field, { countryCodes })
    }
  }
)

/**
 * Validates the value to be a valid postal code.
 * Optionally restricts validation to specific country codes.
 *
 * @example
 * vine.string().postalCode()
 * vine.string().postalCode({ countryCode: ['US', 'GB', 'CA'] })
 * vine.string().postalCode({ countryCode: ['FR', 'DE'] })
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
 * Validates the value to be a valid UUID (Universally Unique Identifier).
 * Optionally restricts validation to specific UUID versions.
 *
 * @example
 * vine.string().uuid()
 * vine.string().uuid({ version: [4] })
 * vine.string().uuid({ version: [1, 4, 5] })
 */
export const uuidRule = createRule<{ version?: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8)[] } | undefined>(
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
 * Validates the value to be a valid ULID (Universally Unique Lexicographically Sortable Identifier).
 * ULIDs are 26 characters long and sortable by time.
 *
 * @example
 * vine.string().ulid()
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
 * Validates the value contains only ASCII characters (codes 0-127).
 * Rejects any characters outside the standard ASCII range.
 *
 * @example
 * vine.string().ascii()
 */
export const asciiRule = createRule(function ascii(value, _, field) {
  if (!helpers.isAscii(value as string)) {
    field.report(messages.ascii, 'ascii', field)
  }
})

/**
 * Validates the value to be a valid IBAN (International Bank Account Number).
 * Validates format, check digits, and country-specific patterns.
 *
 * @example
 * vine.string().iban()
 */
export const ibanRule = createRule(function iban(value, _, field) {
  if (!helpers.isIBAN(value as string)) {
    field.report(messages.iban, 'iban', field)
  }
})

/**
 * Validates the value to be a valid JWT (JSON Web Token).
 * Validates the token structure but does not verify the signature.
 *
 * @example
 * vine.string().jwt()
 */
export const jwtRule = createRule(function jwt(value, _, field) {
  if (!helpers.isJWT(value as string)) {
    field.report(messages.jwt, 'jwt', field)
  }
})

/**
 * Ensures the value is a string containing valid latitude and longitude coordinates.
 * Accepts format like "40.7128,-74.0060" (latitude,longitude).
 *
 * @example
 * vine.string().coordinates()
 */
export const coordinatesRule = createRule(function coordinates(value, _, field) {
  if (!helpers.isLatLong(value as string)) {
    field.report(messages.coordinates, 'coordinates', field)
  }
})

/**
 * Trims leading and trailing whitespace from the string value.
 * Mutates the field value by removing whitespace characters.
 *
 * @example
 * vine.string().trim()
 */
export const trimRule = createRule(function trim(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate((value as string).trim(), field)
})

/**
 * Normalizes the email address by applying transformations.
 * Supports options like lowercasing and removing dots from Gmail addresses.
 *
 * @example
 * vine.string().email().normalizeEmail()
 * vine.string().email().normalizeEmail({ gmail_remove_dots: true })
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
 * Converts the field value to UPPERCASE using locale-aware conversion.
 * Mutates the field value to uppercase.
 *
 * @example
 * vine.string().toUpperCase()
 * vine.string().toUpperCase('tr-TR')
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
 * Converts the field value to lowercase using locale-aware conversion.
 * Mutates the field value to lowercase.
 *
 * @example
 * vine.string().toLowerCase()
 * vine.string().toLowerCase('tr-TR')
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
 * Transforms strings like "hello_world" to "helloWorld".
 *
 * @example
 * vine.string().toCamelCase()
 */
export const toCamelCaseRule = createRule(function toCamelCase(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate(camelcase(value as string), field)
})

/**
 * Escapes HTML entities in the string to prevent XSS attacks.
 * Converts characters like <, >, &, ", ' to their HTML entity equivalents.
 *
 * @example
 * vine.string().escape()
 */
export const escapeRule = createRule(function escape(value, _, field) {
  if (!field.isValid) {
    return
  }

  field.mutate(escapeValue.default(value as string), field)
})

/**
 * Normalizes a URL by applying standardization rules.
 * Supports options like removing trailing slashes, sorting query parameters, and stripping default ports.
 *
 * @example
 * vine.string().url().normalizeUrl()
 * vine.string().url().normalizeUrl({ stripWWW: true })
 * vine.string().url().normalizeUrl({ sortQueryParameters: true })
 */
export const normalizeUrlRule = createRule<undefined | NormalizeUrlOptions>(
  function normalizeUrlValue(value, options, field) {
    if (!field.isValid) {
      return
    }

    field.mutate(normalizeUrl(value as string, options), field)
  }
)
