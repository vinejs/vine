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

import { OTYPE, PARSE } from '../symbols.js'
import { messages } from '../defaults.js'
import { SimpleErrorReporter } from '../reporters/simple_error_reporter.js'
import type { Infer, SchemaTypes, ValidationOptions } from '../types.js'

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
export class VineValidator<Schema extends SchemaTypes> {
  /**
   * Reference to static types
   */
  declare [OTYPE]: Schema[typeof OTYPE]

  /**
   * Messages provider to use on the validator
   */
  messagesProvider: MessagesProviderContact

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
      messagesProvider: MessagesProviderContact
    }
  ) {
    const { compilerNode, refs } = this.#parse(schema)

    this.#refs = refs
    this.#validateFn = new Compiler(compilerNode, {
      convertEmptyStringsToNull: options.convertEmptyStringsToNull,
      messages: COMPILER_ERROR_MESSAGES,
    }).compile()

    this.messagesProvider = options.messagesProvider
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
  validate(data: any, options?: ValidationOptions): Promise<Infer<Schema>> {
    const errorReporter = options?.errorReporter || new SimpleErrorReporter()
    const messagesProvider = options?.messagesProvider || this.messagesProvider
    return this.#validateFn(data, options?.meta || {}, this.#refs, messagesProvider, errorReporter)
  }
}
