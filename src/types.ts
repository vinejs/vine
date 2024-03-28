/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type dayjs from 'dayjs'
import type { Options as UrlOptions } from 'normalize-url'
import type { IsURLOptions } from 'validator/lib/isURL.js'
import type { IsEmailOptions } from 'validator/lib/isEmail.js'
import type { PostalCodeLocale } from 'validator/lib/isPostalCode.js'
import type { NormalizeEmailOptions } from 'validator/lib/normalizeEmail.js'
import type { IsMobilePhoneOptions, MobilePhoneLocale } from 'validator/lib/isMobilePhone.js'
import type {
  ParseFn,
  RefsStore,
  TransformFn,
  FieldContext,
  CompilerNodes,
  MessagesProviderContact,
  ErrorReporterContract as BaseReporter,
} from '@vinejs/compiler/types'

import type { helpers } from './vine/helpers.js'
import type { ValidationError } from './errors/validation_error.js'
import type { OTYPE, COTYPE, PARSE, VALIDATION, UNIQUE_NAME, IS_OF_TYPE, ITYPE } from './symbols.js'

/**
 * Options accepted by the mobile number validation
 */
export type MobileOptions = { locale?: MobilePhoneLocale[] } & IsMobilePhoneOptions

/**
 * Options accepted by the email address validation
 */
export type EmailOptions = IsEmailOptions

/**
 * Options accepted by the normalize email
 */
export { NormalizeEmailOptions }

/**
 * Options accepted by the URL validation
 */
export type URLOptions = IsURLOptions

/**
 * Options accepted by the credit card validation
 */
export type CreditCardOptions = {
  provider: ('amex' | 'dinersclub' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'visa')[]
}

/**
 * Options accepted by the passport validation
 */
export type PassportOptions = {
  countryCode: (typeof helpers)['passportCountryCodes'][number][]
}

/**
 * Options accepted by the postal code validation
 */
export type PostalCodeOptions = {
  countryCode: PostalCodeLocale[]
}

/**
 * Options accepted by the alpha rule
 */
export type AlphaOptions = {
  allowSpaces?: boolean
  allowUnderscores?: boolean
  allowDashes?: boolean
}

export type NormalizeUrlOptions = UrlOptions

/**
 * Options accepted by the alpha numeric rule
 */
export type AlphaNumericOptions = AlphaOptions

/**
 * Re-exporting selected types from compiler
 */
export type {
  Refs,
  FieldContext,
  RefIdentifier,
  ConditionalFn,
  MessagesProviderContact,
} from '@vinejs/compiler/types'

/**
 * Representation of a native enum like type
 */
export type EnumLike = { [K: string]: string | number; [number: number]: string }

/**
 * Representation of fields and messages accepted by the messages
 * provider
 */
export type ValidationMessages = Record<string, string>
export type ValidationFields = Record<string, string>

/**
 * Constructable schema type refers to any type that can be
 * constructed for type inference and compiler output
 */
export interface ConstructableSchema<Inputs, Output, CamelCaseOutput> {
  [ITYPE]: Inputs
  [OTYPE]: Output
  [COTYPE]: CamelCaseOutput
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes
  clone(): this

  /**
   * Implement if you want schema type to be used with the unionOfTypes
   */
  [UNIQUE_NAME]?: string
  [IS_OF_TYPE]?: (value: unknown, field: FieldContext) => boolean
}
export type SchemaTypes = ConstructableSchema<any, any, any>

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
  field: FieldContext
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
  Exclude<Schema[typeof OTYPE], undefined>,
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
 * A set of options accepted by the date field
 */
export type DateFieldOptions = {
  formats?: dayjs.OptionType
}

/**
 * A set of options accepted by the equals rule
 * on the date field
 */
export type DateEqualsOptions = {
  compare?: dayjs.OpUnitType
  format?: dayjs.OptionType
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
export type UnionNoMatchCallback<Input> = (value: Input, field: FieldContext) => any

/**
 * Error reporters must implement the reporter contract interface
 */
export interface ErrorReporterContract extends BaseReporter {
  createError(): ValidationError
}

/**
 * The validator function to validate metadata given to a validation
 * pipeline
 */
export type MetaDataValidator = (meta: Record<string, any>) => void

/**
 * Options accepted during the validate call.
 */
export type ValidationOptions<MetaData extends Record<string, any> | undefined> = {
  /**
   * Messages provider is used to resolve error messages during
   * the validation lifecycle
   */
  messagesProvider?: MessagesProviderContact

  /**
   * Validation errors are reported directly to an error reporter. The reporter
   * can decide how to format and output errors.
   */
  errorReporter?: () => ErrorReporterContract
} & ([undefined] extends MetaData
  ? {
      meta?: MetaData
    }
  : {
      meta: MetaData
    })

/**
 * Infers the schema type
 */
export type Infer<Schema extends { [OTYPE]: any }> = Schema[typeof OTYPE]
export type InferInput<Schema extends { [ITYPE]: any }> = Schema[typeof ITYPE]

/**
 * Comparison operators supported by requiredWhen
 * rule
 */
export type NumericComparisonOperators = '>' | '<' | '>=' | '<='
export type ArrayComparisonOperators = 'in' | 'notIn'
export type ComparisonOperators = ArrayComparisonOperators | NumericComparisonOperators | '=' | '!='
