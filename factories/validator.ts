/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AssertionError, deepEqual } from 'node:assert'

import type { FieldContext, Validation } from '../src/types.js'
import { SimpleErrorReporter } from '../src/reporters/simple_error_reporter.js'
import { SimpleMessagesProvider } from '../src/messages_provider/simple_messages_provider.js'

/**
 * Exposes API's for writing validation assertions
 */
export class ValidationAssertion {
  #outputValue: any
  #reporter: SimpleErrorReporter

  constructor(outputValue: any, reporter: SimpleErrorReporter) {
    this.#outputValue = outputValue
    this.#reporter = reporter
  }

  /**
   * Creates an assertion error instance
   */
  #assertionError(
    options: ConstructorParameters<typeof AssertionError>[0] & { showDiff?: boolean }
  ) {
    const assertion = new AssertionError(options)
    Object.defineProperty(assertion, 'showDiff', { value: true })
    return assertion
  }

  /**
   * Assert the output value of validation. The output value is
   * same as the input value, unless "mutate" method is called
   */
  assertOutput(expectedValue: any) {
    deepEqual(this.#outputValue, expectedValue)
  }

  /**
   * Assert one or more validation errors have occurred
   */
  assertHasErrors() {
    if (!this.#reporter.hasErrors) {
      throw this.#assertionError({
        message: `Expected validation to report one or more errors`,
        operator: 'strictEqual',
        stackStartFn: this.assertHasErrors,
      })
    }
  }

  /**
   * Assert one or more validation errors have occurred
   */
  assertDoesNotHaveErrors() {
    if (this.#reporter.hasErrors) {
      throw this.#assertionError({
        message: `Expected validation to report zero errors`,
        operator: 'strictEqual',
        stackStartFn: this.assertDoesNotHaveErrors,
      })
    }
  }

  /**
   * Assert the number of errors have occurred
   */
  assertErrorsCount(count: number) {
    const errorsCount = this.#reporter.errors.length

    if (errorsCount !== count) {
      throw this.#assertionError({
        message: `Expected validation to report "${count}" errors. Received "${errorsCount}"`,
        expected: count,
        actual: errorsCount,
        operator: 'strictEqual',
        stackStartFn: this.assertErrorsCount,
        showDiff: true,
      })
    }
  }

  /**
   * Assert error messages to include a given error message
   */
  assertError(message: string) {
    const messages = this.#reporter.errors.map((e) => e.message)

    if (!messages.includes(message)) {
      throw this.#assertionError({
        message: `Expected validation errors to include "${message}" message`,
        expected: [message],
        actual: messages,
        operator: 'includes',
        stackStartFn: this.assertError,
        showDiff: true,
      })
    }
  }
}

/**
 * Validator factory exposes the API to execute validations
 * during tests
 */
export class ValidatorFactory {
  #getReporter() {
    return new SimpleErrorReporter(new SimpleMessagesProvider({}))
  }

  /**
   * Executes a validation against the provided value
   */
  execute(
    validation: Validation<any> | Validation<any>[],
    value: any,
    ctx: Partial<FieldContext> = {}
  ) {
    const errorReporter = this.#getReporter()
    const isDefined = value !== null && value !== undefined
    const data = ctx.fieldName ? { [ctx.fieldName]: value } : value

    let outputValue = value

    const normalizedCtx: FieldContext = {
      data: data,
      parent: data,
      value: value,
      fieldName: '' as any,
      wildCardPath: '',
      isArrayMember: false,
      isDefined: isDefined,
      isValid: true,
      meta: {},
      mutate(newValue) {
        outputValue = newValue
      },
      report(message, rule, context, args) {
        this.isValid = false
        errorReporter.report(message, rule, context, args)
      },
      ...ctx,
    }

    const validations = Array.isArray(validation) ? validation : [validation]
    for (let one of validations) {
      if ((isDefined || one.rule.implicit) && normalizedCtx.isValid) {
        one.rule.validator(value, one.options, normalizedCtx)
      }
    }

    return new ValidationAssertion(outputValue, errorReporter)
  }
}
