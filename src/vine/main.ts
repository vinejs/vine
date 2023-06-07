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
import { createRule } from './create_rule.js'
import { errorMessages } from '../defaults.js'
import { SchemaBuilder } from '../schema/builder.js'
import { SimpleErrorReporter } from '../reporters/simple_error_reporter.js'
import { SimpleMessagesProvider } from '../messages_provider/simple_messages_provider.js'

import type {
  Infer,
  VineOptions,
  SchemaTypes,
  ValidationFields,
  ValidationOptions,
  ValidationMessages,
} from '../types.js'

export class Vine extends SchemaBuilder {
  /**
   * Configuration options.
   */
  #options: VineOptions = {
    convertEmptyStringsToNull: false,
    errorReporter: () => new SimpleErrorReporter(),
    messagesProvider: (messages, fields) => new SimpleMessagesProvider(messages, fields),
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
  #parse(schema: SchemaTypes) {
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
   * Creates an instance of the pre-configured messages provider
   */
  getMessagesProvider(messages: ValidationMessages, fields: ValidationFields) {
    return this.#options.messagesProvider(messages, fields)
  }

  /**
   * Creates an instance of the pre-configured error reporter.
   */
  getErrorReporter() {
    return this.#options.errorReporter()
  }

  /**
   * Configure vine. The options are applied globally and impacts
   * all the schemas.
   *
   * ```ts
   * vine.configure({
   *   convertEmptyStringsToNull: true,
   * })
   * ```
   */
  configure(options: Partial<VineOptions>) {
    Object.assign(this.#options, options)
  }

  /**
   * Pre-compiles a schema into a validation function.
   *
   * ```ts
   * const validate = vine.compile(schema)
   * await validate({ data })
   * ```
   */
  compile<Schema extends SchemaTypes>(schema: Schema) {
    const { compilerNode, refs } = this.#parse(schema)
    const globalErrorReporter = this.#options.errorReporter
    const globalMessagesProvider = this.#options.messagesProvider

    const validateFn = new Compiler(compilerNode, {
      convertEmptyStringsToNull: this.#options.convertEmptyStringsToNull,
      messages: {
        required: errorMessages.required,
        array: errorMessages.array,
        object: errorMessages.object,
      },
    }).compile()

    /**
     * Validate input data against a pre-defined vine schema. Optionally,
     * you can define error messages, fields, a custom messages provider,
     * or an error reporter.
     *
     * ```ts
     * await validate({ data })
     * await validate({ data, messages, fields })
     *
     * await validate({ data, messages, fields }, {
     *   errorReporter
     * })
     * ```
     */
    return function validate(
      options: ValidationOptions,
      vineOptions?: VineOptions
    ): Promise<Infer<Schema>> {
      const errorReporter = vineOptions?.errorReporter || globalErrorReporter
      const messagesProvider = vineOptions?.messagesProvider || globalMessagesProvider

      return validateFn(
        options.data,
        {},
        refs,
        messagesProvider(options.messages || {}, options.fields || {}),
        errorReporter()
      )
    }
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
    options: ValidationOptions & { schema: Schema },
    vineOptions?: VineOptions
  ): Promise<Infer<Schema>> {
    return this.compile(options.schema)(options, vineOptions)
  }
}
