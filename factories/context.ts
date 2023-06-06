/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../src/vine/helpers.js'
import type { FieldContext } from '../src/types.js'
import { ErrorReporterContract } from '@vinejs/compiler/types'
import { SimpleErrorReporter } from '../src/reporters/simple_error_reporter.js'

/**
 * Exposes API to create a dummy context for a field
 */
export class ContextFactory {
  create(fieldName: string, value: any, errorReporter?: ErrorReporterContract) {
    const reporter = errorReporter || new SimpleErrorReporter()
    return {
      value: value,
      isArrayMember: false,
      parent: { [fieldName]: value } as any,
      data: { [fieldName]: value },
      fieldName: fieldName as any,
      wildCardPath: fieldName,
      isDefined: helpers.exists(value),
      isValid: true,
      meta: {},
      mutate(newValue) {
        this.value = newValue
        this.isDefined = helpers.exists(newValue)
        return this
      },
      report(message, rule, context, args) {
        this.isValid = false
        reporter.report(message, rule, context, args)
      },
    } satisfies FieldContext
  }
}
