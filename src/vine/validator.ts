/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler, refsBuilder } from '@vinejs/compiler'
import type { StandardSchemaV1 } from '@standard-schema/spec'
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
  CompilerNodes,
} from '../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Error messages to share with the compiler
 */
const COMPILER_ERROR_MESSAGES = {
  required: messages.required,
  array: messages.array,
  object: messages.object,
}

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
   *
   * @param schema - The schema to parse
   * @returns Object containing compiler node and refs
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
   * Validate data against a schema. Optionally, you can share metaData with
   * the validator
   *
   * ```ts
   * await validator.validate(data)
   * await validator.validate(data, { meta: {} })
   *
   * await validator.validate(data, {
   *   meta: { userId: auth.user.id },
   *   errorReporter,
   *   messagesProvider
   * })
   * ```
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
   * Performs validation without throwing the validation
   * exception. Instead, the validation errors are
   * returned as the first argument.
   *
   *
   * ```ts
   * await validator.tryValidate(data)
   * await validator.tryValidate(data, { meta: {} })
   *
   * await validator.tryValidate(data, {
   *   meta: { userId: auth.user.id },
   *   errorReporter,
   *   messagesProvider
   * })
   * ```
   *
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
   * @returns Object containing cloned schema and refs
   */
  'toJSON'() {
    const { schema, refs } = this.#compiled
    return {
      schema: structuredClone(schema),
      refs,
    }
  }

  'toJSONSchema'(): JSONSchema7 {
    const schema = this.#compiled.schema.schema as CompilerNodes
    return schema.jsonSchema
  }

  readonly '~standard': StandardSchemaV1.Props<Schema[typeof ITYPE], Schema[typeof OTYPE]> = {
    version: 1,
    vendor: 'vinejs',
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
            path: message.field,
          }
        }),
      }
    },
  }
}
