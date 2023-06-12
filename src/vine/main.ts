/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from './helpers.js'
import { createRule } from './create_rule.js'
import { SchemaBuilder } from '../schema/builder.js'
import { SimpleMessagesProvider } from '../messages_provider/simple_messages_provider.js'

import { VineValidator } from './validator.js'
import { fields, messages } from '../defaults.js'
import type { Infer, MessagesProviderContact, SchemaTypes, ValidationOptions } from '../types.js'

/**
 * Validate user input with type-safety using a pre-compiled schema.
 */
export class Vine extends SchemaBuilder {
  /**
   * Messages provider to use on the validator
   */
  messagesProvider: MessagesProviderContact = new SimpleMessagesProvider(messages, fields)

  /**
   * Control whether or not to convert empty strings to null
   */
  convertEmptyStringsToNull: boolean = false

  /**
   * Helpers to perform type-checking or cast types keeping
   * HTML forms serialization behavior in mind.
   */
  helpers = helpers

  /**
   * Convert a validation function to a Vine schema rule
   */
  createRule = createRule

  /**
   * Pre-compiles a schema into a validation function.
   *
   * ```ts
   * const validate = vine.compile(schema)
   * await validate({ data })
   * ```
   */
  compile<Schema extends SchemaTypes>(schema: Schema) {
    return new VineValidator(schema, {
      convertEmptyStringsToNull: this.convertEmptyStringsToNull,
      messagesProvider: this.messagesProvider,
    })
  }

  /**
   * Validate data against a schema. Optionally, you can define
   * error messages, fields, a custom messages provider,
   * or an error reporter.
   *
   * ```ts
   * await vine.validate({ schema, data })
   * await vine.validate({ schema, data, messages, fields })
   *
   * await vine.validate({ schema, data, messages, fields }, {
   *   errorReporter
   * })
   * ```
   */
  validate<Schema extends SchemaTypes>(
    options: {
      /**
       * Schema to use for validation
       */
      schema: Schema

      /**
       * Data to validate
       */
      data: any
    } & ValidationOptions
  ): Promise<Infer<Schema>> {
    const validator = this.compile(options.schema)
    return validator.validate(options.data, options)
  }
}
