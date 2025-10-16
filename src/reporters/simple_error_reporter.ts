/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_VALIDATION_ERROR } from '../errors/main.js'
import { ValidationError } from '../errors/validation_error.js'
import type { ErrorReporterContract, FieldContext, SimpleError } from '../types.js'

/**
 * SimpleErrorReporter collects validation error messages as an array of objects.
 * It's the default error reporter used by Vine and provides a simple, structured
 * format for validation errors.
 *
 * Each error object contains:
 * - message: Human-readable error message
 * - field: The field path where validation failed
 * - rule: The validation rule that failed
 * - index: Array index (for array element errors)
 * - meta: Additional error metadata
 *
 * @example
 * const reporter = new SimpleErrorReporter()
 * // After validation errors are reported:
 * console.log(reporter.errors)
 * // [{ message: "Required", field: "email", rule: "required" }]
 */
export class SimpleErrorReporter implements ErrorReporterContract {
  /**
   * Flag indicating whether any validation errors have been reported
   */
  hasErrors: boolean = false

  /**
   * Collection of all reported validation errors
   */
  errors: SimpleError[] = []

  /**
   * Report a validation error by adding it to the errors collection.
   *
   * @param message - The human-readable error message
   * @param rule - The name of the validation rule that failed
   * @param field - The field context containing field path and metadata
   * @param meta - Optional additional metadata about the error
   */
  report(
    message: string,
    rule: string,
    field: FieldContext,
    meta?: Record<string, any> | undefined
  ) {
    const error: SimpleError = {
      message,
      rule,
      field: field.getFieldPath(),
    }

    if (meta) {
      error.meta = meta
    }
    if (field.isArrayMember) {
      error.index = field.name as number
    }

    this.hasErrors = true
    this.errors.push(error)
  }

  /**
   * Creates and returns a ValidationError instance containing all reported errors.
   * This method is called by the validation engine when validation fails.
   *
   * @returns A ValidationError containing all collected error messages
   */
  createError(): ValidationError {
    return new E_VALIDATION_ERROR(this.errors)
  }
}
