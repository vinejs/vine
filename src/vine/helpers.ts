/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import validator from 'validator'

const BOOLEAN_POSITIVES = ['1', 1, 'true', true, 'on']
const BOOLEAN_NEGATIVES = ['0', 0, 'false', false]

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
    return Number(value)
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

  isEmail: validator.default.isEmail,
  isURL: validator.default.isURL,
  isAlpha: validator.default.isAlpha,
  isAlphaNumeric: validator.default.isAlphanumeric,
  isIP: validator.default.isIP,
  isUUID: validator.default.isUUID,
  isAscii: validator.default.isAscii,
  isCreditCard: validator.default.isCreditCard,
  isHexColor: validator.default.isHexColor,
  isIBAN: validator.default.isIBAN,
  isJWT: validator.default.isJWT,
  isLatLong: validator.default.isLatLong,
  isMobilePhone: validator.default.isMobilePhone,
  isPassportNumber: validator.default.isPassportNumber,
  isPostalCode: validator.default.isPostalCode,
  isSlug: validator.default.isSlug,
  isDecimal: validator.default.isDecimal,

  isActiveURL: (url: string) => {},

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
}
