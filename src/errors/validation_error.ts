/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Validation error is a superset of Error class with validation
 * error messages
 */
export class ValidationError extends Error {
  /**
   * Http status code for the validation error
   */
  status: number = 422

  /**
   * Internal code for handling the validation error
   * exception
   */
  code: string = 'E_VALIDATION_ERROR'

  constructor(
    public messages: any,
    options?: ErrorOptions
  ) {
    super('Validation failure', options)
    const ErrorConstructor = this.constructor as typeof ValidationError
    Error.captureStackTrace(this, ErrorConstructor)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  toString() {
    return `${this.name} [${this.code}]: ${this.message}`
  }
}
