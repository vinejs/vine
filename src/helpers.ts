/*
 * @vinejs/vine
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const BOOLEAN_POSITIVES = ['1', 1, 'true', true, 'on']
const BOOLEAN_NEGATIVES = ['0', 0, 'false', false]

/**
 * Dry collection of helpers used across the codebase to coerce
 * and type-check values from HTML forms.
 */
export class VineHelpers {
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
  }

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
  }

  /**
   * Check if the value is a valid string. This method narrows
   * the type of value to string.
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  /**
   * Check if the value is a plain JavaScript object. This method
   * filters out null and Arrays and does not consider them as Objects.
   */
  isObject<Value>(value: unknown): value is Record<PropertyKey, Value> {
    return !!(value && typeof value === 'object' && !Array.isArray(value))
  }

  /**
   * Check if the value is an Array.
   */
  isArray<Value>(value: unknown): value is Value[] {
    return Array.isArray(value)
  }

  /**
   * Check if the value is a number or a string representation of a number.
   */
  isNumeric(value: any): boolean {
    return !Number.isNaN(Number(value))
  }

  /**
   * Casts the value to a number using the Number method.
   * Returns NaN when unable to cast.
   */
  asNumber(value: any): number {
    return Number(value)
  }

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
  }
}
