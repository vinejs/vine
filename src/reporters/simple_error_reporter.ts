/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValidationError } from '../errors/validation_error.js'
import type { ErrorReporterContract, FieldContext, MessagesProviderContact } from '../types.js'

/**
 * Simple error reporter collects error messages as an array of object.
 * Each object has following properties.
 *
 * - message: string
 * - field: string
 * - args?: Record<string, any>
 */
export class SimpleErrorReporter implements ErrorReporterContract {
  /**
   * Messages provider to resolve errors
   */
  #messagesProvider: MessagesProviderContact

  /**
   * Boolean to know one or more errors have been reported
   */
  hasErrors: boolean = false

  /**
   * Collection of errors
   */
  errors: { message: string; field: string; args?: Record<string, any> }[] = []

  constructor(messagesProvider: MessagesProviderContact) {
    this.#messagesProvider = messagesProvider
  }

  /**
   * Report an error. The "rawMessage" is used when no custom message
   * is defined for the field or the rule.
   */
  report(
    rawMessage: string,
    rule: string,
    ctx: FieldContext,
    args?: Record<string, any> | undefined
  ) {
    this.hasErrors = true
    this.errors.push({
      message: this.#messagesProvider.getMessage(rawMessage, rule, ctx, args),
      field: ctx.wildCardPath,
      ...(args ? { args } : {}),
    })
  }

  /**
   * Returns an instance of the validation error
   */
  createError(): ValidationError {
    return new ValidationError(this.errors)
  }
}
