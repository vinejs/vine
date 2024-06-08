/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import delve from 'dlv'
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
import isAlphanumeric from 'validator/lib/isAlphanumeric.js'
import isPassportNumber from 'validator/lib/isPassportNumber.js'
import isPostalCode, { type PostalCodeLocale } from 'validator/lib/isPostalCode.js'
import isMobilePhone, { type MobilePhoneLocale } from 'validator/lib/isMobilePhone.js'
// @ts-ignore type missing from @types/validator
import { locales as mobilePhoneLocales } from 'validator/lib/isMobilePhone.js'
// @ts-ignore type missing from @types/validator
import { locales as postalCodeLocales } from 'validator/lib/isPostalCode.js'

import type { FieldContext } from '../types.js'

const BOOLEAN_POSITIVES = ['1', 1, 'true', true, 'on']
const BOOLEAN_NEGATIVES = ['0', 0, 'false', false]

const ULID = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/

/**
 * Collection of helpers used across the codebase to coerce
 * and type-check values from HTML forms.
 */
export const helpers = {
  /**
   * Returns true when value is not null and neither
   * undefined
   */
  exists(value: any): boolean {
    return value !== null && value !== undefined
  },

  /**
   * Returns true when value is null or value is undefined
   */
  isMissing(value: any): boolean {
    return !this.exists(value)
  },

  /**
   * Returns true when the value is one of the following.
   *
   * true
   * 1
   * "1"
   * "true"
   * "on"
   */
  isTrue(value: any): boolean {
    return BOOLEAN_POSITIVES.includes(value)
  },

  /**
   * Returns true when the value is one of the following.
   *
   * false
   * 0
   * "0"
   * "false"
   */
  isFalse(value: any) {
    return BOOLEAN_NEGATIVES.includes(value)
  },

  /**
   * Check if the value is a valid string. This method narrows
   * the type of value to string.
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  /**
   * Check if the value is a plain JavaScript object. This method
   * filters out null and Arrays and does not consider them as Objects.
   */
  isObject<Value>(value: unknown): value is Record<PropertyKey, Value> {
    return !!(value && typeof value === 'object' && !Array.isArray(value))
  },

  /**
   * Check if an object has all the mentioned keys
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
   * Check if the value is an Array.
   */
  isArray<Value>(value: unknown): value is Value[] {
    return Array.isArray(value)
  },

  /**
   * Check if the value is a number or a string representation of a number.
   */
  isNumeric(value: any): boolean {
    return !Number.isNaN(Number(value))
  },

  /**
   * Casts the value to a number using the Number method.
   * Returns NaN when unable to cast.
   */
  asNumber(value: any): number {
    return value === null ? Number.NaN : Number(value)
  },

  /**
   * Casts the value to a boolean.
   *
   * - [true, 1, "1", "true", "on"] will be converted to true.
   * - [false, 0, "0", "false"] will be converted to false.
   * - Everything else will return null. So make sure to handle that case.
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

  isEmail: isEmail.default,
  isURL: isURL.default,
  isAlpha: isAlpha.default,
  isAlphaNumeric: isAlphanumeric.default,
  isIP: isIP.default,
  isUUID: isUUID.default,
  isAscii: isAscii.default,
  isCreditCard: isCreditCard.default,
  isIBAN: isIBAN.default,
  isJWT: isJWT.default,
  isLatLong: isLatLong.default,
  isMobilePhone: isMobilePhone.default,
  isPassportNumber: isPassportNumber.default,
  isPostalCode: isPostalCode.default,
  isSlug: isSlug.default,
  isDecimal: isDecimal.default,
  mobileLocales: mobilePhoneLocales as MobilePhoneLocale[],
  postalCountryCodes: postalCodeLocales as PostalCodeLocale[],
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
   * Check if the value is a valid ULID
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
   * Check if the value is a valid color hexcode
   */
  isHexColor: (value: string) => {
    if (!value.startsWith('#')) {
      return false
    }
    return isHexColor.default(value)
  },

  /**
   * Check if a URL has valid `A` or `AAAA` DNS records
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
   * Returns the nested value from the field root
   * object or the sibling value from the field
   * parent object
   */
  getNestedValue(key: string, field: FieldContext) {
    if (key.indexOf('.') > -1) {
      return delve(field.data, key)
    }
    return field.parent[key]
  },
}
