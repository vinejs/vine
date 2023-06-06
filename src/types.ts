/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  ParseFn,
  RefsStore,
  TransformFn,
  FieldContext,
  CompilerNodes,
  ErrorReporterContract as BaseReporter,
} from '@vinejs/compiler/types'
import type { ValidationError } from './errors/validation_error.js'
import type { BRAND, CBRAND, PARSE, VALIDATION } from './symbols.js'

/**
 * Re-exporting selected types from compiler
 */
export type { Refs, RefIdentifier, FieldContext, ConditionalFn } from '@vinejs/compiler/types'

/**
 * Error reporters must implement the reporter contract interface
 */
export interface ErrorReporterContract extends BaseReporter {
  createError(): ValidationError
}

/**
 * Representation of a native enum like type
 */
export type EnumLike = { [K: string]: string | number; [number: number]: string }

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
 * A rule builder is an object that implements the "VALIDATION"
 * method and returns [[Validation]] type
 */
export interface RuleBuilder {
  [VALIDATION](): Validation<any>
}

/**
 * The transform function to mutate the output value
 */
export type Transformer<Schema extends SchemaTypes, Output> = TransformFn<
  Exclude<Schema[typeof BRAND], undefined>,
  Output
>

/**
 * The parser function to mutate the input value
 */
export type Parser = ParseFn

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
 * Options accepted when compiling schema types.
 */
export type ParserOptions = {
  toCamelCase: boolean
}

/**
 * Method to invoke when union has no match
 */
export type UnionNoMatchCallback<Input> = (value: Input, ctx: FieldContext) => any

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
  [BRAND]: Output
  [CBRAND]: CamelCaseOutput
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes
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

  /**
   * Validation errors are reported directly to an error reporter. The reporter
   * can decide how to format and output errors.
   */
  errorReporter: (messagesProvider: MessagesProviderContact) => ErrorReporterContract
}

/**
 * Infers the schema type
 */
export type Infer<Schema extends ConstructableSchema<any, any>> = Schema[typeof BRAND]

/**
 * Validation options accepted by the validate method
 */
export type ValidationOptions =
  | {
      data: any
    }
  | {
      data: any
      messages: Record<string, any>
    }
  | {
      data: any
      messagesProvider: MessagesProviderContact
    }
  | {
      data: any
      errorReporter: ErrorReporterContract
    }
