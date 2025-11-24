/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import delve from 'dlv'
import dayjs from 'dayjs'
import isIP from 'validator/lib/isIP.js'
import isJWT from 'validator/lib/isJWT.js'
import isURL from 'validator/lib/isURL.js'
import isSlug from 'validator/lib/isSlug.js'
import isIBAN from 'validator/lib/isIBAN.js'
import isUUID from 'validator/lib/isUUID.js'
import isAscii from 'validator/lib/isAscii.js'
import isEmail from 'validator/lib/isEmail.js'
import isAlpha from 'validator/lib/isAlpha.js'
import isLatLong from 'validator/lib/isLatLong.js'
import isDecimal from 'validator/lib/isDecimal.js'
import isHexColor from 'validator/lib/isHexColor.js'
import isCreditCard from 'validator/lib/isCreditCard.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isAlphanumeric from 'validator/lib/isAlphanumeric.js'
import isStrongPassword from 'validator/lib/isStrongPassword.js'
import isPassportNumber from 'validator/lib/isPassportNumber.js'
import isVAT from 'validator/lib/isVAT.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isPostalCode, { type PostalCodeLocale } from 'validator/lib/isPostalCode.js'
import isMobilePhone, { type MobilePhoneLocale } from 'validator/lib/isMobilePhone.js'
// @ts-ignore type missing from @types/validator
import { locales as mobilePhoneLocales } from 'validator/lib/isMobilePhone.js'
// @ts-ignore type missing from @types/validator
import { locales as postalCodeLocales } from 'validator/lib/isPostalCode.js'

import type {
  DateEqualsOptions,
  DateFieldOptions,
  FieldContext,
  PropertiesToOptional,
  SchemaTypes,
} from '../types.js'

/**
 * Values that are considered true in HTML form context.
 * Includes boolean true, number 1, string '1', 'true', and 'on' (for checkboxes).
 */
const BOOLEAN_POSITIVES = ['1', 1, 'true', true, 'on']

/**
 * Values that are considered false in HTML form context.
 * Includes boolean false, number 0, string '0', and 'false'.
 */
const BOOLEAN_NEGATIVES = ['0', 0, 'false', false]

/**
 * Default date formats used when no specific format is provided.
 * Supports date-only (YYYY-MM-DD) and datetime (YYYY-MM-DD HH:mm:ss) formats.
 */
const DEFAULT_DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']

/**
 * Regular expression for validating ULID (Universally Unique Lexicographically Sortable Identifier) format.
 * ULIDs are 26 characters long using Crockford's Base32 encoding.
 */
const ULID = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

/**
 * Collection of utility helpers used across the Vine validation library.
 * These helpers provide type-checking, coercion, and validation functions
 * that are optimized for HTML form data handling.
 *
 * @example
 * helpers.isString(value) // Type guard for strings
 * helpers.asBoolean(value) // Convert to boolean with HTML form semantics
 * helpers.isEmail(email) // Validate email addresses
 */
export const helpers = {
  /**
   * Checks if a value exists (is not null and not undefined).
   * Useful for checking if optional form fields have been provided.
   *
   * @param value - The value to check
   * @returns True if value is not null and not undefined
   *
   * @example
   * helpers.exists('hello') // true
   * helpers.exists(0) // true
   * helpers.exists(null) // false
   * helpers.exists(undefined) // false
   */
  exists(value: any): boolean {
    return value !== null && value !== undefined
  },

  /**
   * Checks if a value is missing (null or undefined).
   * The inverse of the exists method.
   *
   * @param value - The value to check
   * @returns True if value is null or undefined
   *
   * @example
   * helpers.isMissing(null) // true
   * helpers.isMissing(undefined) // true
   * helpers.isMissing('') // false
   * helpers.isMissing(0) // false
   */
  isMissing(value: any): boolean {
    return !this.exists(value)
  },

  /**
   * Checks if a value represents a truthy boolean in HTML form context.
   * Recognizes common HTML form representations of true values.
   *
   * Accepted truthy values:
   * - true (boolean)
   * - 1 (number)
   * - "1" (string)
   * - "true" (string)
   * - "on" (string, for checkboxes)
   *
   * @param value - The value to check
   * @returns True if value represents a truthy boolean
   *
   * @example
   * helpers.isTrue(true) // true
   * helpers.isTrue('on') // true (checkbox checked)
   * helpers.isTrue('1') // true (form input)
   * helpers.isTrue('yes') // false
   */
  isTrue(value: any): boolean {
    return BOOLEAN_POSITIVES.includes(value)
  },

  /**
   * Checks if a value represents a falsy boolean in HTML form context.
   * Recognizes common HTML form representations of false values.
   *
   * Accepted falsy values:
   * - false (boolean)
   * - 0 (number)
   * - "0" (string)
   * - "false" (string)
   *
   * @param value - The value to check
   * @returns True if value represents a falsy boolean
   *
   * @example
   * helpers.isFalse(false) // true
   * helpers.isFalse('0') // true (form input)
   * helpers.isFalse('false') // true (form input)
   * helpers.isFalse('no') // false
   */
  isFalse(value: any) {
    return BOOLEAN_NEGATIVES.includes(value)
  },

  /**
   * Type guard that checks if a value is a string.
   * Narrows the TypeScript type to string when returning true.
   *
   * @param value - The value to check
   * @returns True if value is a string, with type narrowing
   *
   * @example
   * if (helpers.isString(value)) {
   *   // value is now typed as string
   *   console.log(value.toUpperCase())
   * }
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  /**
   * Type guard that checks if a value is a plain JavaScript object.
   * Excludes null, arrays, and other non-plain objects.
   *
   * @template Value - The type of values in the object
   * @param value - The value to check
   * @returns True if value is a plain object, with type narrowing
   *
   * @example
   * helpers.isObject({}) // true
   * helpers.isObject([]) // false
   * helpers.isObject(null) // false
   * helpers.isObject(new Date()) // true (but not recommended for validation)
   */
  isObject<Value>(value: unknown): value is Record<PropertyKey, Value> {
    return !!(value && typeof value === 'object' && !Array.isArray(value))
  },

  /**
   * Checks if an object contains all the specified keys.
   * Useful for validating object structure before processing.
   *
   * @param value - The object to check
   * @param keys - Array of key names that must exist
   * @returns True if all keys exist in the object
   *
   * @example
   * helpers.hasKeys({ name: 'John', age: 30 }, ['name']) // true
   * helpers.hasKeys({ name: 'John' }, ['name', 'age']) // false
   */
  hasKeys(value: Record<string, any>, keys: string[]) {
    for (let key of keys) {
      if (key in value === false) {
        return false
      }
    }

    return true
  },

  /**
   * Type guard that checks if a value is an array.
   * Narrows the TypeScript type to array when returning true.
   *
   * @template Value - The type of elements in the array
   * @param value - The value to check
   * @returns True if value is an array, with type narrowing
   *
   * @example
   * if (helpers.isArray(value)) {
   *   // value is now typed as array
   *   console.log(value.length)
   * }
   */
  isArray<Value>(value: unknown): value is Value[] {
    return Array.isArray(value)
  },

  /**
   * Checks if a value is numeric (number or string representing a number).
   * Useful for validating form inputs that should contain numeric values.
   *
   * @param value - The value to check
   * @returns True if value can be converted to a valid number
   *
   * @example
   * helpers.isNumeric(42) // true
   * helpers.isNumeric('42') // true
   * helpers.isNumeric('42.5') // true
   * helpers.isNumeric('abc') // false
   */
  isNumeric(value: any): boolean {
    return !Number.isNaN(Number(value))
  },

  /**
   * Converts a value to a number using JavaScript's Number() constructor.
   * Handles null values explicitly by returning NaN.
   *
   * @param value - The value to convert to a number
   * @returns The numeric representation, or NaN if conversion fails
   *
   * @example
   * helpers.asNumber('42') // 42
   * helpers.asNumber('42.5') // 42.5
   * helpers.asNumber(null) // NaN
   * helpers.asNumber('abc') // NaN
   */
  asNumber(value: any): number {
    return value === null ? Number.NaN : Number(value)
  },

  /**
   * Converts a value to a boolean using HTML form semantics.
   * Returns null for values that cannot be reliably converted.
   *
   * Conversion rules:
   * - [true, 1, "1", "true", "on"] → true
   * - [false, 0, "0", "false"] → false
   * - Everything else → null
   *
   * @param value - The value to convert
   * @returns Boolean value, or null if conversion is ambiguous
   *
   * @example
   * helpers.asBoolean('true') // true
   * helpers.asBoolean('on') // true (checkbox checked)
   * helpers.asBoolean('false') // false
   * helpers.asBoolean('maybe') // null (ambiguous)
   */
  asBoolean(value: any): boolean | null {
    if (this.isTrue(value)) {
      return true
    }

    if (this.isFalse(value)) {
      return false
    }

    return null
  },

  /**
   * Converts a value to a Day.js date object with flexible format support.
   * Handles timestamps, ISO dates, and custom formats with intelligent fallbacks.
   *
   * @param value - The value to convert to a date (string, number, Date, etc.)
   * @param format - Date format(s) to use for parsing. Can be:
   *   - Array of format strings (e.g., ['YYYY-MM-DD', 'DD/MM/YYYY'])
   *   - Single format string
   *   - Object with format and strict parsing options
   *   - Special values: 'x' for timestamps, 'iso8601' for ISO dates
   * @returns Object containing the parsed Day.js instance and normalized formats
   *
   * @example
   * // Parse with default formats
   * helpers.asDayJS('2023-12-25')
   * // { dateTime: dayjs('2023-12-25'), formats: ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'] }
   *
   * // Parse timestamp
   * helpers.asDayJS('1703548800000', ['x'])
   * // { dateTime: dayjs(1703548800000), formats: ['x'] }
   *
   * // Parse with custom format
   * helpers.asDayJS('25/12/2023', ['DD/MM/YYYY'])
   * // { dateTime: dayjs('25/12/2023', 'DD/MM/YYYY'), formats: ['DD/MM/YYYY'] }
   *
   * // ISO date fallback
   * helpers.asDayJS('2023-12-25T10:30:00Z', ['iso8601'])
   * // { dateTime: dayjs('2023-12-25T10:30:00Z'), formats: ['iso8601'] }
   */
  asDayJS(value: any, format: DateFieldOptions['formats']) {
    let isTimestampAllowed = false
    let isISOAllowed = false
    let formats: DateEqualsOptions['format'] = format || DEFAULT_DATE_FORMATS

    /**
     * DayJS mutates the formats property under the hood. Therefore
     * we have to create a shallow clone before passing formats.
     *
     * https://github.com/iamkun/dayjs/issues/2136
     */
    if (Array.isArray(formats)) {
      formats = [...formats]
      isTimestampAllowed = formats.includes('x')
      isISOAllowed = formats.includes('iso8601')
    } else if (typeof formats !== 'string') {
      formats = { ...formats }
      isTimestampAllowed = formats.format === 'x'
      isISOAllowed = formats.format === 'iso'
    }

    const valueAsNumber = isTimestampAllowed ? helpers.asNumber(value) : value
    let dateTime: dayjs.Dayjs | undefined

    /**
     * The timestamp validation does not work with formats array.
     * Therefore we validate is separately without passing any
     * formats.
     *
     * Otherwise we parse the date with formats
     */
    if (isTimestampAllowed && !Number.isNaN(valueAsNumber)) {
      dateTime = dayjs(valueAsNumber)
    } else {
      dateTime = dayjs(value, formats, true)
    }

    /**
     * If datetime is invalid and the ISO format is allowed,
     * then we reattempt to parse the date without formats
     */
    if (!dateTime.isValid() && isISOAllowed) {
      dateTime = dayjs(value)
    }

    return { dateTime, formats }
  },

  /**
   * Compares two values with intelligent type coercion.
   * The input value is cast to match the type of the expected value
   * for HTML form-friendly comparisons.
   *
   * @param inputValue - The input value to compare
   * @param expectedValue - The expected value to compare against
   * @returns Object with comparison result and the casted input value
   *
   * @example
   * // Number comparison
   * helpers.compareValues('42', 42)
   * // { isEqual: true, casted: 42 }
   *
   * // Boolean comparison
   * helpers.compareValues('true', true)
   * // { isEqual: true, casted: true }
   *
   * // String comparison (no casting)
   * helpers.compareValues('hello', 'world')
   * // { isEqual: false, casted: 'hello' }
   */
  compareValues(inputValue: unknown, expectedValue: any) {
    let input = inputValue

    /**
     * Normalize the field value based on the expected value type
     */
    if (typeof expectedValue === 'boolean') {
      input = this.asBoolean(inputValue)
    } else if (typeof expectedValue === 'number') {
      input = this.asNumber(inputValue)
    }

    /**
     * Perform comparison and return results
     */
    return {
      isEqual: input === expectedValue,
      casted: input,
    }
  },

  /** Validates email addresses using comprehensive rules */
  isEmail: isEmail.default,
  /** Validates URLs with protocol and domain checking */
  isURL: isURL.default,
  /** Validates alphabetic characters only */
  isAlpha: isAlpha.default,
  /** Validates alphanumeric characters only */
  isAlphaNumeric: isAlphanumeric.default,
  /** Validates IP addresses (IPv4 and IPv6) */
  isIP: isIP.default,
  /** Validates UUID strings in various formats */
  isUUID: isUUID.default,
  /** Validates ASCII character strings */
  isAscii: isAscii.default,
  /** Validates credit card numbers using Luhn algorithm */
  isCreditCard: isCreditCard.default,
  /** Validates International Bank Account Numbers */
  isIBAN: isIBAN.default,
  /** Validates JSON Web Tokens */
  isJWT: isJWT.default,
  /** Validates latitude/longitude coordinate pairs */
  isLatLong: isLatLong.default,
  /** Validates strong password criteria */
  isStrongPassword: isStrongPassword.default,
  /** Validates mobile phone numbers for various locales */
  isMobilePhone: isMobilePhone.default,
  /** Validates passport numbers for supported countries */
  isPassportNumber: isPassportNumber.default,
  /** Validates VAT numbers for supported countries */
  isVAT: isVAT.default,
  /** Validates postal codes for various countries */
  isPostalCode: isPostalCode.default,
  /** Validates URL slugs (lowercase, hyphenated strings) */
  isSlug: isSlug.default,
  /** Validates decimal numbers */
  isDecimal: isDecimal.default,
  /** Array of supported mobile phone locales/countries */
  mobileLocales: mobilePhoneLocales as MobilePhoneLocale[],
  /** Array of supported postal code country codes */
  postalCountryCodes: postalCodeLocales as PostalCodeLocale[],
  /** Array of supported passport country codes */
  passportCountryCodes: [
    'AM',
    'AR',
    'AT',
    'AU',
    'AZ',
    'BE',
    'BG',
    'BR',
    'BY',
    'CA',
    'CH',
    'CY',
    'CZ',
    'DE',
    'DK',
    'DZ',
    'ES',
    'FI',
    'FR',
    'GB',
    'GR',
    'HR',
    'HU',
    'IE',
    'IN',
    'ID',
    'IR',
    'IS',
    'IT',
    'JM',
    'JP',
    'KR',
    'KZ',
    'LI',
    'LT',
    'LU',
    'LV',
    'LY',
    'MT',
    'MZ',
    'MY',
    'MX',
    'NL',
    'NZ',
    'PH',
    'PK',
    'PL',
    'PT',
    'RO',
    'RU',
    'SE',
    'SL',
    'SK',
    'TH',
    'TR',
    'UA',
    'US',
  ] as const,

  /**
   * Validates if a value is a valid ULID (Universally Unique Lexicographically Sortable Identifier).
   * ULIDs are 26-character strings that are lexicographically sortable and URL-safe.
   *
   * @param value - The value to validate
   * @returns True if value is a valid ULID
   *
   * @example
   * helpers.isULID('01ARZ3NDEKTSV4RRFFQ69G5FAV') // true
   * helpers.isULID('invalid-ulid') // false
   * helpers.isULID('7ZZZZZZZZZZZZZZZZZZZZZZZZZ') // true (max valid ULID)
   * helpers.isULID('8AAAAAAAAAAAAAAAAAAAAAAAAA') // false (overflow)
   */
  isULID(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false
    }

    // Largest valid ULID is '7ZZZZZZZZZZZZZZZZZZZZZZZZZ'
    // https://github.com/ulid/spec#overflow-errors-when-parsing-base32-strings
    if (value[0] > '7') {
      return false
    }

    return ULID.test(value)
  },

  /**
   * Validates if a value is a valid hexadecimal color code.
   * Requires the '#' prefix and supports 3, 6, or 8 character hex codes.
   *
   * @param value - The string to validate as a hex color
   * @returns True if value is a valid hex color code
   *
   * @example
   * helpers.isHexColor('#FF0000') // true (red)
   * helpers.isHexColor('#f00') // true (short red)
   * helpers.isHexColor('#FF000080') // true (red with alpha)
   * helpers.isHexColor('FF0000') // false (missing #)
   * helpers.isHexColor('#GGGGGG') // false (invalid hex)
   */
  isHexColor: (value: string) => {
    if (!value.startsWith('#')) {
      return false
    }
    return isHexColor.default(value)
  },

  /**
   * Validates if a URL has valid DNS records (A or AAAA records).
   * This performs an actual DNS lookup to verify the domain exists.
   *
   * @param url - The URL to check for DNS records
   * @returns Promise resolving to true if DNS records exist
   *
   * @example
   * await helpers.isActiveURL('https://example.com') // true
   * await helpers.isActiveURL('https://nonexistent-domain-12345.com') // false
   *
   * This function requires network access and may be slow.
   * Consider caching results for better performance.
   */
  isActiveURL: async (url: string): Promise<boolean> => {
    const { resolve4, resolve6 } = await import('node:dns/promises')

    try {
      const { hostname } = new URL(url)
      const v6Addresses = await resolve6(hostname)
      if (v6Addresses.length) {
        return true
        /* c8 ignore next 4 */
      } else {
        const v4Addresses = await resolve4(hostname)
        return v4Addresses.length > 0
      }
    } catch {
      return false
    }
  },

  /**
   * Check if all the elements inside the dataset are unique.
   *
   * In case of an array of objects, you must provide one or more keys
   * for the fields that must be unique across the objects.
   *
   * ```ts
   * helpers.isDistinct([1, 2, 4, 5]) // true
   *
   * // Null and undefined values are ignored
   * helpers.isDistinct([1, null, 2, null, 4, 5]) // true
   *
   * helpers.isDistinct([
   *   {
   *     email: 'foo@bar.com',
   *     name: 'foo'
   *   },
   *   {
   *     email: 'baz@bar.com',
   *     name: 'baz'
   *   }
   * ], 'email') // true
   *
   * helpers.isDistinct([
   *   {
   *     email: 'foo@bar.com',
   *     tenant_id: 1,
   *     name: 'foo'
   *   },
   *   {
   *     email: 'foo@bar.com',
   *     tenant_id: 2,
   *     name: 'baz'
   *   }
   * ], ['email', 'tenant_id']) // true
   * ```
   */
  isDistinct: (dataSet: any[], fields?: string | string[]): boolean => {
    const uniqueItems: Set<any> = new Set()

    /**
     * Check for duplicates when no fields are provided
     */
    if (!fields) {
      for (let item of dataSet) {
        if (helpers.exists(item)) {
          if (uniqueItems.has(item)) {
            return false
          } else {
            uniqueItems.add(item)
          }
        }
      }
      return true
    }

    /**
     * Checking for duplicates when one or more fields are mentioned
     */
    const fieldsList = Array.isArray(fields) ? fields : [fields]
    for (let item of dataSet) {
      /**
       * Only process item, if it is an object and has all the fields
       * required for uniqueness check
       */
      if (helpers.isObject(item) && helpers.hasKeys(item, fieldsList)) {
        const element = fieldsList.map((field) => item[field]).join('_')
        if (uniqueItems.has(element)) {
          return false
        } else {
          uniqueItems.add(element)
        }
      }
    }

    return true
  },

  /**
   * Retrieves a nested value from the validation context.
   * Supports both dot notation for deep access and direct parent access.
   *
   * @param key - The key or dot-notation path to the value
   * @param field - The field context containing data and parent references
   * @returns The value at the specified path, or undefined if not found
   *
   * @example
   * // Dot notation for nested access
   * helpers.getNestedValue('user.profile.name', field)
   *
   * // Direct parent access
   * helpers.getNestedValue('confirmPassword', field)
   *
   * // Deep object access
   * helpers.getNestedValue('config.database.host', field)
   */
  getNestedValue(key: string, field: FieldContext) {
    if (key.indexOf('.') > -1) {
      return delve(field.data, key)
    }
    return field.parent[key]
  },

  /**
   * Converts all properties of an object schema to optional.
   *
   * @param props - The object with schema properties
   * @returns New object with all properties marked as optional
   */
  optional<Props extends Record<string, SchemaTypes>>(props: Props): PropertiesToOptional<Props> {
    const result: Record<string, SchemaTypes> = {}

    for (const name of Object.keys(props)) {
      let field = props[name].clone()

      if ('optional' in field && typeof field.optional === 'function') {
        field = field.optional()
      }

      result[name] = field
    }

    return result as PropertiesToOptional<Props>
  },
}
