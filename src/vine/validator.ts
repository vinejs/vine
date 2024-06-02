/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler, refsBuilder } from '@vinejs/compiler'
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

/**
 * Error messages to share with the compiler
 */
const COMPILER_ERROR_MESSAGES = {
  required: messages.required,
  array: messages.array,
  object: messages.object,
}

/**
 * Vine Validator exposes the API to validate data using a pre-compiled
 * schema.
 */
export class VineValidator<
  Schema extends SchemaTypes,
  MetaData extends undefined | Record<string, any>,
> {
  /**
   * Reference to static types
   */
  declare [ITYPE]: Schema[typeof ITYPE];
  declare [OTYPE]: Schema[typeof OTYPE]

  /**
   * Reference to the compiled schema
   */
  #compiled: {
    schema: RootNode
    refs: Refs
  }

  /**
   * Messages provider to use on the validator
   */
  messagesProvider: MessagesProviderContact

  /**
   * Error reporter to use on the validator
   */
  errorReporter: () => ErrorReporterContract

  /**
   * Parses schema to compiler nodes.
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
  declare validate: (
    data: any,
    ...[options]: [undefined] extends MetaData
      ? [options?: ValidationOptions<MetaData> | undefined]
      : [options: ValidationOptions<MetaData>]
  ) => Promise<Infer<Schema>>

  constructor(
    schema: Schema,
    options: {
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
        let normalizedOptions = validateOptions ?? ({} as ValidationOptions<MetaData>)
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
        let normalizedOptions = validateOptions ?? ({} as ValidationOptions<MetaData>)
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
   */
  async tryValidate(
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
   * Returns the compiled schema and refs.
   */
  toJSON() {
    const { schema, refs } = this.#compiled
    return {
      schema: structuredClone(schema),
      refs,
    }
  }
}
