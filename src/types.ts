/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerNodes, FieldContext, RefsStore } from '@vinejs/compiler/types'

/**
 * Representation of a function that performs validation.
 * The function receives the following arguments.
 *
 * - the current value of the input field
 * - runtime options
 * - field context
 */
export type Validator<Options extends any> = (
  value: unknown,
  options: Options,
  ctx: FieldContext
) => any | Promise<any>

/**
 * A validation rule is a combination of a validator and
 * some metadata required at the time of compiling the
 * rule.
 *
 * Think of this type as "Validator" + "metaData"
 */
export type ValidationRule<Options extends any> = {
  validator: Validator<Options>
  isAsync: boolean
  implicit: boolean
}

/**
 * Validation is a combination of a validation rule and the options
 * to supply to validator at the time of validating the field.
 *
 * Think of this type as "ValidationRule" + "options"
 */
export type Validation<Options extends any> = {
  /**
   * Options to pass to the validator function.
   */
  options?: Options

  /**
   * The rule to use
   */
  rule: ValidationRule<Options>
}

/**
 * The transform function to mutate the output value
 */
export type Transformer<Schema extends SchemaTypes, Output> = (
  value: Exclude<Schema['__brand'], undefined>,
  ctx: FieldContext
) => Output

/**
 * The parser function to mutate the input value
 */
export type Parser = (value: unknown) => any

/**
 * A set of options accepted by the field
 */
export type FieldOptions = {
  allowNull: boolean
  bail: boolean
  isOptional: boolean
  parse?: Parser
}

/**
 * Messages provider is used to resolve validation error messages
 * during validation.
 */
export interface MessagesProviderContact {
  /**
   * Returns a validation message for a given field + rule. The args
   * may get defined by a validation rule to share additional context.
   */
  getMessage(
    rawMessage: string,
    rule: string,
    ctx: FieldContext,
    args?: Record<string, any>
  ): string
}

/**
 * Constructable schema type refers to any type that can be
 * constructed for type inference and compiler output
 */
export interface ConstructableSchema<Output, CamelCaseOutput> {
  __brand: Output
  __camelCaseBrand: CamelCaseOutput

  /**
   * Return compiler output
   */
  compile(propertyName: string, refs: RefsStore, transform?: Transformer<any, any>): CompilerNodes
}

/**
 * Possible schema types. This list is as broad as it can be
 */
export type SchemaTypes = ConstructableSchema<any, any>

/**
 * Options accepted by vine
 */
export type VineOptions = {
  /**
   * Normalize empty string values to null
   */
  convertEmptyStringsToNull: boolean

  /**
   * Messages provider is used to resolve error messages during
   * the validation lifecycle
   */
  messagesProvider: (messages: Record<string, string>) => MessagesProviderContact
}

export type Infer<Schema extends ConstructableSchema<any, any>> = Schema['__brand']
