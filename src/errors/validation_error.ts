/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * ValidationError is a specialized Error class that represents validation
 * failures. It contains structured error messages and HTTP status information
 * for easy integration with web frameworks.
 *
 * @example
 * try {
 *   await vine.validate({ schema, data })
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log(error.messages) // Structured validation errors
 *     console.log(error.status)   // HTTP 422
 *   }
 * }
 */
export class ValidationError extends Error {
  /**
   * HTTP status code for the validation error (422 Unprocessable Entity)
   */
  status: number = 422

  /**
   * Internal error code for programmatic error handling
   */
  code: string = 'E_VALIDATION_ERROR'

  /**
   * Creates a new ValidationError with structured error messages.
   *
   * @param messages - Structured validation error messages
   * @param options - Optional error options for the base Error class
   */
  constructor(
    public messages: any,
    options?: ErrorOptions
  ) {
    super('Validation failure', options)
    const ErrorConstructor = this.constructor as typeof ValidationError
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ErrorConstructor)
    }
  }

  /**
   * Returns the string tag for this object type.
   *
   * @returns The constructor name of this error
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  /**
   * Returns a string representation of the validation error.
   *
   * @returns Formatted error string with name, code, and message
   */
  toString() {
    return `${this.name} [${this.code}]: ${this.message}`
  }
}
