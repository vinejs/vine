/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler, refsBuilder } from '@vinejs/compiler'
import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { MessagesProviderContact, Refs, RootNode } from '@vinejs/compiler/types'

import { messages } from '../defaults.js'
import { ITYPE, OTYPE, PARSE } from '../symbols.js'
import { ValidationError } from '../errors/validation_error.js'
import type {
  Infer,
  SchemaTypes,
  MetaDataValidator,
  ValidationOptions,
  ErrorReporterContract,
} from '../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Error messages to share with the compiler.
 * Maps core validation types to their default error messages.
 */
const COMPILER_ERROR_MESSAGES = {
  required: messages.required,
  array: messages.array,
  object: messages.object,
}

/**
 * Reusable empty object to avoid creating new instances for default options.
 */
const EMPTY_OBJECT = {}

/**
 * Vine Validator exposes the API to validate data using a pre-compiled
 * schema. This class provides high-performance validation by compiling
 * schemas once and reusing them for multiple validations.
 *
 * @template Schema - The schema type being validated
 * @template MetaData - The metadata type passed to validation
 *
 * @example
 * const validator = vine.compile(schema)
 * const result = await validator.validate(data)
 */
export class VineValidator<
  Schema extends SchemaTypes,
  MetaData extends undefined | Record<string, any>,
> implements StandardSchemaV1 {
  /**
   * Reference to static input type for TypeScript inference
   */
  declare [ITYPE]: Schema[typeof ITYPE];

  /**
   * Reference to static output type for TypeScript inference
   */
  declare [OTYPE]: Schema[typeof OTYPE]

  /**
   * Reference to the compiled schema containing the validation tree
   * and references for reuse during validation
   */
  #compiled: {
    schema: RootNode
    refs: Refs
  }

  /**
   * JSON Schema is only computed when asked.
   * We cache it in validator for reusability.
   */
  #jsonSchema?: JSONSchema7

  /**
   * Messages provider instance used for internationalization
   * and custom error message formatting
   */
  'messagesProvider': MessagesProviderContact

  /**
   * Error reporter factory function used for formatting
   * and collecting validation errors
   */
  'errorReporter': () => ErrorReporterContract

  /**
   * Parses schema to compiler nodes for optimization and compilation.
   * This internal method converts the schema into an AST representation
   * that can be efficiently compiled into validation functions.
   *
   * @param schema - The schema to parse
   */
  #parse(schema: Schema) {
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
   * Validates data against the compiled schema. Returns the validated and typed data
   * or throws a ValidationError if validation fails.
   *
   * @param data - The data to validate
   * @param options - Optional validation options including metadata, custom error reporter, and messages provider
   *
   * @example
   * await validator.validate({ name: 'John', age: 30 })
   *
   * @example
   * // With metadata
   * await validator.validate(data, {
   *   meta: { userId: '123' }
   * })
   *
   * @example
   * // With custom error reporter and messages provider
   * await validator.validate(data, {
   *   meta: { userId: auth.user.id },
   *   errorReporter: () => new CustomErrorReporter(),
   *   messagesProvider: customMessagesProvider
   * })
   */
  declare 'validate': (
    data: any,
    ...[options]: [undefined] extends MetaData
      ? [options?: ValidationOptions<MetaData> | undefined]
      : [options: ValidationOptions<MetaData>]
  ) => Promise<Infer<Schema>>

  /**
   * Creates a new VineValidator instance with a compiled schema.
   *
   * @param schema - The schema to compile for validation
   * @param options - Configuration options for the validator
   * @param options.convertEmptyStringsToNull - Whether to convert empty strings to null
   * @param options.metaDataValidator - Optional metadata validator function
   * @param options.messagesProvider - Messages provider for error formatting
   * @param options.errorReporter - Error reporter factory function
   */
  'constructor'(
    public schema: Schema,
    protected options: {
      convertEmptyStringsToNull: boolean
      metaDataValidator?: MetaDataValidator
      messagesProvider: MessagesProviderContact
      errorReporter: () => ErrorReporterContract
    }
  ) {
    /**
     * Compile the schema to a re-usable function
     */
    const { compilerNode, refs } = this.#parse(schema)
    this.#compiled = { schema: compilerNode, refs }

    const metaDataValidator = options.metaDataValidator
    const validateFn = new Compiler(compilerNode, {
      convertEmptyStringsToNull: options.convertEmptyStringsToNull,
      messages: COMPILER_ERROR_MESSAGES,
    }).compile()

    /**
     * Assign error reporter and messages provider to public
     * properties so that they can be overridden at the
     * validator level.
     */
    this.errorReporter = options.errorReporter
    this.messagesProvider = options.messagesProvider

    /**
     * Creating specialized functions with and without the
     * metadata validator to optimize the runtime
     * performance.
     */
    if (metaDataValidator) {
      this.validate = (
        data: any,
        validateOptions?: ValidationOptions<MetaData>
      ): Promise<Infer<Schema>> => {
        let normalizedOptions = validateOptions ?? (EMPTY_OBJECT as ValidationOptions<MetaData>)
        const meta = normalizedOptions.meta ?? {}
        const errorReporter = normalizedOptions.errorReporter ?? this.errorReporter
        const messagesProvider = normalizedOptions.messagesProvider ?? this.messagesProvider

        metaDataValidator!(meta)
        return validateFn(data, meta, refs, messagesProvider, errorReporter())
      }
    } else {
      this.validate = (
        data: any,
        validateOptions?: ValidationOptions<MetaData>
      ): Promise<Infer<Schema>> => {
        let normalizedOptions = validateOptions ?? (EMPTY_OBJECT as ValidationOptions<MetaData>)
        const meta = normalizedOptions.meta ?? {}
        const errorReporter = normalizedOptions.errorReporter ?? this.errorReporter
        const messagesProvider = normalizedOptions.messagesProvider ?? this.messagesProvider
        return validateFn(data, meta, refs, messagesProvider, errorReporter())
      }
    }
  }

  /**
   * Performs validation without throwing a ValidationError exception.
   * Instead, returns a tuple where the first element is the error (if any)
   * and the second is the validated data (if successful).
   *
   * @param data - The data to validate
   * @param options - Optional validation options including metadata, custom error reporter, and messages provider
   *
   * @example
   * const [error, result] = await validator.tryValidate(data)
   * if (error) {
   *   console.log(error.messages)
   * } else {
   *   console.log(result)
   * }
   *
   * @example
   * // With metadata
   * const [error, result] = await validator.tryValidate(data, {
   *   meta: { userId: '123' }
   * })
   *
   * @example
   * // With custom error reporter
   * const [error, result] = await validator.tryValidate(data, {
   *   meta: { userId: auth.user.id },
   *   errorReporter: () => new CustomErrorReporter(),
   *   messagesProvider: customMessagesProvider
   * })
   */
  async 'tryValidate'(
    data: any,
    ...[options]: [undefined] extends MetaData
      ? [options?: ValidationOptions<MetaData> | undefined]
      : [options: ValidationOptions<MetaData>]
  ): Promise<[ValidationError, null] | [null, Infer<Schema>]> {
    try {
      const result = await this.validate(data, options!)
      return [null, result]
    } catch (error) {
      if (error instanceof ValidationError) {
        return [error, null]
      }
      throw error
    }
  }

  /**
   * Returns the compiled schema and refs as a JSON-serializable object.
   * Useful for caching compiled schemas or debugging validation logic.
   *
   * @example
   * const compiled = validator.toJSON()
   * console.log(compiled.schema)
   * console.log(compiled.refs)
   */
  'toJSON'() {
    const { schema, refs } = this.#compiled
    return {
      schema: structuredClone(schema),
      refs,
    }
  }

  /**
   * Converts the validator's schema to JSON Schema Draft 7 format.
   * The result is cached for subsequent calls.
   *
   * @example
   * const jsonSchema = validator.toJSONSchema()
   * console.log(JSON.stringify(jsonSchema, null, 2))
   */
  'toJSONSchema'(): JSONSchema7 {
    if (!this.#jsonSchema) {
      this.#jsonSchema = this.schema.toJSONSchema()
    }

    return this.#jsonSchema
  }

  /**
   * Standard Schema V1 compliance implementation.
   * Provides interoperability with other validation libraries through the
   * Standard Schema specification.
   *
   * @see https://github.com/standard-schema/standard-schema
   */
  readonly '~standard': StandardSchemaV1.Props<Schema[typeof ITYPE], Schema[typeof OTYPE]> &
    StandardJSONSchemaV1.Props<Schema[typeof ITYPE], Schema[typeof OTYPE]> = {
    version: 1,
    vendor: 'vinejs',

    jsonSchema: {
      input: () => {
        return this.toJSONSchema() as Record<string, unknown>
      },
      output: () => {
        throw new Error('Vine.js does not support creating validators using JSON Schema.')
      },
    },

    validate: async (data: unknown) => {
      const [error, result] = await this.tryValidate(data, {} as any)
      if (result) {
        return {
          value: result,
        }
      }

      return {
        issues: error?.messages.map((message: any) => {
          return {
            ...message,
            /**
             * The Standard Schema spec requires `path` to be a
             * `ReadonlyArray<PropertyKey | PathSegment>`. `message.field` is a
             * dotted string (e.g. "user.name"), so we split it into segments.
             * Otherwise consumers that iterate `path` (e.g. TanStack Form) walk
             * the array-like string character by character and misattach errors.
             */
            path: typeof message.field === 'string' ? message.field.split('.') : message.field,
          }
        }),
      }
    },
  }
}
