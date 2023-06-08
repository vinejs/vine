/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Vine } from '../../src/vine/main.js'
import { E_VALIDATION_ERROR } from '../../src/errors/main.js'
import { SimpleErrorReporter } from '../../src/reporters/simple_error_reporter.js'
import { SimpleMessagesProvider } from '../../src/messages_provider/simple_messages_provider.js'

import type {
  VineOptions,
  FieldContext,
  MessagesProviderContact,
  ErrorReporterContract,
} from '../../src/types.js'

test.group('VineJS', () => {
  test('create instance of default messages provider', ({ assert }) => {
    const vine = new Vine()
    assert.instanceOf(vine.getMessagesProvider({}, {}), SimpleMessagesProvider)
  })

  test('create instance of default error reporter', ({ assert }) => {
    const vine = new Vine()
    assert.instanceOf(vine.getErrorReporter(), SimpleErrorReporter)
  })

  test('configure vine', async ({ assert }) => {
    const vine = new Vine()
    vine.configure({ convertEmptyStringsToNull: true })

    const schema = vine.object({
      username: vine.string().nullable(),
    })
    const data = {
      username: '',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      username: null,
    })
  })

  test('define custom messages provider to validate method', async ({ assert }) => {
    class CustomMessagesProvider implements MessagesProviderContact {
      constructor(public messages: Record<string, string>, public fields: Record<string, string>) {}
      getMessage(defaultMessage: string, rule: string) {
        return `${rule}: ${this.messages[rule] || defaultMessage}`
      }
    }

    const options: Partial<VineOptions> = {
      messagesProvider: (messages, fields) => {
        return new CustomMessagesProvider(messages, fields)
      },
    }

    const vine = new Vine()
    const schema = vine.object({
      username: vine.string().nullable(),
    })
    const data = {}

    await assert.validationErrors(vine.validate({ schema, data }, options), [
      {
        field: 'username',
        rule: 'required',
        message: 'required: The {{ field }} field must be defined',
      },
    ])
  })

  test('define custom error reporter to validate method', async ({ assert }) => {
    class JSONAPIErrorReporter implements ErrorReporterContract {
      /**
       * A flag to know if one or more errors have been
       * reported
       */
      hasErrors: boolean = false

      /**
       * A collection of errors. Feel free to give accurate types
       * to this property
       */
      errors: any[] = []

      /**
       * The report method is called by VineJS
       */
      report(message: string, rule: string, ctx: FieldContext, meta?: any) {
        this.hasErrors = true

        /**
         * Collecting errors as per the JSONAPI spec
         */
        this.errors.push({
          code: rule,
          detail: message,
          source: {
            pointer: ctx.wildCardPath,
          },
          ...(meta ? { meta } : {}),
        })
      }

      /**
       * Creates and returns an instance of the
       * ValidationError class
       */
      createError() {
        return E_VALIDATION_ERROR(this.errors)
      }
    }

    const options: Partial<VineOptions> = {
      errorReporter: () => {
        return new JSONAPIErrorReporter()
      },
    }

    const vine = new Vine()
    const schema = vine.object({
      username: vine.string().nullable(),
    })
    const data = {}

    await assert.validationErrors(vine.validate({ schema, data }, options), [
      {
        code: 'required',
        detail: 'The username field must be defined',
        source: {
          pointer: 'username',
        },
      },
    ])
  })
})
