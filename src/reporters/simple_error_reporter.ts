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
import type { ErrorReporterContract, FieldContext } from '../types.js'

/**
 * Shape of the error message collected by the SimpleErrorReporter
 */
type SimpleError = {
  message: string
  field: string
  rule: string
  index?: number
  meta?: Record<string, any>
}

/**
 * Simple error reporter collects error messages as an array of object.
 * Each object has following properties.
 *
 * - message: string
 * - field: string
 * - rule: string
 * - index?: number (in case of an array member)
 * - args?: Record<string, any>
 */
export class SimpleErrorReporter implements ErrorReporterContract {
  /**
   * Boolean to know one or more errors have been reported
   */
  hasErrors: boolean = false

  /**
   * Collection of errors
   */
  errors: SimpleError[] = []

  /**
   * Report an error.
   */
  report(message: string, rule: string, ctx: FieldContext, meta?: Record<string, any> | undefined) {
    const error: SimpleError = {
      message,
      rule,
      field: ctx.wildCardPath,
    }

    if (meta) {
      error.meta = meta
    }
    if (ctx.isArrayMember) {
      error.index = ctx.fieldName as number
    }

    this.hasErrors = true
    this.errors.push(error)
  }

  /**
   * Returns an instance of the validation error
   */
  createError(): ValidationError {
    return new E_VALIDATION_ERROR(this.errors)
  }
}
