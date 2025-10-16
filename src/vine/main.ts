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
import { ValidationError } from '../errors/validation_error.js'
import { SimpleErrorReporter } from '../reporters/simple_error_reporter.js'
import type {
  Infer,
  SchemaTypes,
  MetaDataValidator,
  ValidationOptions,
  ErrorReporterContract,
  MessagesProviderContact,
} from '../types.js'

/**
 * Main Vine class that provides a fluent API for creating validation schemas
 * and validating user input with type-safety using pre-compiled schemas.
 *
 * @example
 * const vine = new Vine()
 * const schema = vine.object({
 *   name: vine.string(),
 *   age: vine.number()
 * })
 * const result = await vine.validate({ schema, data: { name: 'John', age: 30 } })
 */
export class Vine extends SchemaBuilder {
  /**
   * Messages provider to use on the validator for internationalization
   * and custom error message formatting
   */
  messagesProvider: MessagesProviderContact = new SimpleMessagesProvider(messages, fields)

  /**
   * Error reporter factory function to use on the validator for
   * formatting validation errors
   */
  errorReporter: () => ErrorReporterContract = () => new SimpleErrorReporter()

  /**
   * Control whether or not to convert empty strings to null during validation.
   * Useful for HTML form handling where empty inputs are submitted as empty strings
   */
  convertEmptyStringsToNull: boolean = false

  /**
   * Collection of helper functions to perform type-checking or cast types
   * while keeping HTML forms serialization behavior in mind
   */
  helpers = helpers

  /**
   * Utility function to convert a validation function to a Vine schema rule
   */
  createRule = createRule

  /**
   * Pre-compiles a schema into a validation function for better performance
   * when validating multiple data sets against the same schema.
   *
   * @param schema - The validation schema to compile
   * @returns A compiled validator instance
   *
   * @example
   * const validate = vine.compile(schema)
   * await validate({ data })
   */
  compile<Schema extends SchemaTypes>(schema: Schema) {
    return new VineValidator<Schema, Record<string, any> | undefined>(schema, {
      convertEmptyStringsToNull: this.convertEmptyStringsToNull,
      messagesProvider: this.messagesProvider,
      errorReporter: this.errorReporter,
    })
  }

  /**
   * Define a callback to validate the metadata given to the validator
   * at runtime. Useful for passing additional context like user IDs or permissions.
   *
   * @param callback - Optional validator function for metadata
   * @returns Object with compile method that accepts metadata type
   *
   * @example
   * const validate = vine.withMetaData<{ userId: string }>()
   *   .compile(schema)
   * await validate(data, { meta: { userId: '123' } })
   */
  withMetaData<MetaData extends Record<string, any>>(callback?: MetaDataValidator) {
    return {
      compile: <Schema extends SchemaTypes>(schema: Schema) => {
        return new VineValidator<Schema, MetaData>(schema, {
          convertEmptyStringsToNull: this.convertEmptyStringsToNull,
          messagesProvider: this.messagesProvider,
          errorReporter: this.errorReporter,
          metaDataValidator: callback,
        })
      },
    }
  }

  /**
   * Validate data against a schema. Optionally, you can define
   * error messages, fields, a custom messages provider,
   * or an error reporter.
   *
   * @param options - Configuration object containing schema, data, and validation options
   * @returns Promise resolving to validated and typed data
   * @throws {ValidationError} When validation fails
   *
   * @example
   * await vine.validate({ schema, data })
   * await vine.validate({ schema, data, messages, fields })
   *
   * await vine.validate({ schema, data, messages, fields }, {
   *   errorReporter
   * })
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
    } & ValidationOptions<Record<string, any> | undefined>
  ): Promise<Infer<Schema>> {
    const validator = this.compile(options.schema)
    return validator.validate(options.data, options)
  }

  /**
   * Validate data against a schema without throwing the
   * "ValidationError" exception. Instead the validation
   * errors are returned within the return value.
   *
   * @param options - Configuration object containing schema, data, and validation options
   * @returns Promise resolving to tuple of [error, null] or [null, validatedData]
   *
   * @example
   * await vine.tryValidate({ schema, data })
   * await vine.tryValidate({ schema, data, messages, fields })
   *
   * await vine.tryValidate({ schema, data, messages, fields }, {
   *   errorReporter
   * })
   */
  tryValidate<Schema extends SchemaTypes>(
    options: {
      /**
       * Schema to use for validation
       */
      schema: Schema

      /**
       * Data to validate
       */
      data: any
    } & ValidationOptions<Record<string, any> | undefined>
  ): Promise<[ValidationError, null] | [null, Infer<Schema>]> {
    const validator = this.compile(options.schema)
    return validator.tryValidate(options.data, options)
  }
}
