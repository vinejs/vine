/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorReporterContract } from '@vinejs/compiler/types'

import { helpers } from '../src/vine/helpers.js'
import type { FieldContext, MessagesProviderContact } from '../src/types.js'
import { SimpleErrorReporter } from '../src/reporters/simple_error_reporter.js'
import { SimpleMessagesProvider } from '../src/messages_provider/simple_messages_provider.js'

/**
 * Exposes API to create a dummy field context
 */
export class FieldFactory {
  create(
    fieldName: string,
    value: any,
    messagesProvider?: MessagesProviderContact,
    errorReporter?: ErrorReporterContract
  ) {
    const reporter = errorReporter || new SimpleErrorReporter()
    const provider = messagesProvider || new SimpleMessagesProvider({}, {})

    return {
      value: value,
      isArrayMember: false,
      parent: { [fieldName]: value } as any,
      data: { [fieldName]: value },
      name: fieldName as any,
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
        reporter.report(provider.getMessage(message, rule, context, args), rule, context, args)
      },
    } satisfies FieldContext
  }
}
