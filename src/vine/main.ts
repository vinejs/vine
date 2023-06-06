/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler, refsBuilder } from '@vinejs/compiler'

import { PARSE } from '../symbols.js'
import { helpers } from './helpers.js'
import { VineRoot } from '../schema/root.js'
import { createRule } from './create_rule.js'
import { SchemaBuilder } from '../schema/builder.js'
import { SimpleErrorReporter } from '../reporters/simple_error_reporter.js'
import { SimpleMessagesProvider } from '../messages_provider/simple_messages_provider.js'
import type { Infer, MessagesProviderContact, ValidationOptions, VineOptions } from '../types.js'

export class Vine extends SchemaBuilder {
  /**
   * Configuration options.
   */
  #options: VineOptions = {
    convertEmptyStringsToNull: false,
    errorReporter: (messageProvider) => new SimpleErrorReporter(messageProvider),
    messagesProvider: (messages) => new SimpleMessagesProvider(messages),
  }

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
   * Parses schema to compiler nodes.
   */
  #parse(schema: VineRoot<any, any, any>) {
    const refs = refsBuilder()
    return {
      compilerNode: {
        type: 'root' as const,
        schema: schema[PARSE]('', refs, { toCamelCase: false }),
      },
      refs: refs.toJSON(),
    }
  }

  /**
   * Creates an instance of the messages provider with the given
   * messages
   */
  getMessagesProvider(messages: Record<string, any>) {
    return this.#options.messagesProvider(messages)
  }

  /**
   * Creates an instance of error reporter
   */
  getErrorReporter(messagesProvider: MessagesProviderContact) {
    return this.#options.errorReporter(messagesProvider)
  }

  /**
   * Configure vine. The options are applied globally and impacts
   * all the schemas
   */
  configure(options: Partial<VineOptions>) {
    Object.assign(this.#options, options)
  }

  /**
   * Pre-compiles a schema into a validation function.
   */
  compile<Schema extends VineRoot<any, any, any>>(schema: Schema) {
    const { compilerNode, refs } = this.#parse(schema)
    const errorReporterFactory = this.#options.errorReporter
    const messagesProviderFactory = this.#options.messagesProvider
    const validateFn = new Compiler(compilerNode, this.#options).compile()

    /**
     * Validate input data against a pre-defined Vine schema
     */
    return function validate(options: ValidationOptions): Promise<Infer<Schema>> {
      const errorReporter =
        'errorReporter' in options
          ? options.errorReporter!
          : errorReporterFactory(
              'messagesProvider' in options
                ? options.messagesProvider
                : messagesProviderFactory('messages' in options ? options.messages : {})
            )

      return validateFn(options.data, {}, refs, errorReporter)
    }
  }

  /**
   * Validate data against a pre-compiled schema
   */
  validate<Schema extends VineRoot<any, any, any>>(
    options: ValidationOptions & { schema: Schema }
  ): Promise<Infer<Schema>> {
    return this.compile(options.schema)(options)
  }
}
