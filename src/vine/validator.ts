/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler, refsBuilder } from '@vinejs/compiler'
import type { MessagesProviderContact, Refs } from '@vinejs/compiler/types'

import { messages } from '../defaults.js'
import { OTYPE, PARSE } from '../symbols.js'
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
  declare [OTYPE]: Schema[typeof OTYPE]

  /**
   * Validator to use to validate metadata
   */
  #metaDataValidator?: MetaDataValidator

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
   * Refs computed from the compiled output
   */
  #refs: Refs

  /**
   * Compiled validator function
   */
  #validateFn: ReturnType<Compiler['compile']>

  constructor(
    schema: Schema,
    options: {
      convertEmptyStringsToNull: boolean
      metaDataValidator?: MetaDataValidator
      messagesProvider: MessagesProviderContact
      errorReporter: () => ErrorReporterContract
    }
  ) {
    const { compilerNode, refs } = this.#parse(schema)

    this.#refs = refs
    this.#validateFn = new Compiler(compilerNode, {
      convertEmptyStringsToNull: options.convertEmptyStringsToNull,
      messages: COMPILER_ERROR_MESSAGES,
    }).compile()

    this.errorReporter = options.errorReporter
    this.messagesProvider = options.messagesProvider
    this.#metaDataValidator = options.metaDataValidator
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
  validate(
    data: any,
    ...[options]: [undefined] extends MetaData
      ? [options?: ValidationOptions<MetaData> | undefined]
      : [options: ValidationOptions<MetaData>]
  ): Promise<Infer<Schema>> {
    if (options?.meta && this.#metaDataValidator) {
      this.#metaDataValidator(options.meta)
    }

    const errorReporter = options?.errorReporter || this.errorReporter
    const messagesProvider = options?.messagesProvider || this.messagesProvider
    return this.#validateFn(
      data,
      options?.meta || {},
      this.#refs,
      messagesProvider,
      errorReporter()
    )
  }
}
