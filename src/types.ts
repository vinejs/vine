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
import type { VATCountryCode } from 'validator/lib/isVAT.js'
import type { IsEmailOptions } from 'validator/lib/isEmail.js'
import type { PostalCodeLocale } from 'validator/lib/isPostalCode.js'
import type { NormalizeEmailOptions } from 'validator/lib/normalizeEmail.js'
import type { IsMobilePhoneOptions, MobilePhoneLocale } from 'validator/lib/isMobilePhone.js'
import type {
  ParseFn,
  RefsStore,
  TupleNode,
  ArrayNode,
  UnionNode,
  RecordNode,
  ObjectNode,
  TransformFn,
  LiteralNode,
  FieldContext,
  MessagesProviderContact,
  ErrorReporterContract as BaseReporter,
} from '@vinejs/compiler/types'

import type { helpers } from './vine/helpers.js'
import type { ValidationError } from './errors/validation_error.js'
import type { OTYPE, COTYPE, PARSE, VALIDATION, UNIQUE_NAME, IS_OF_TYPE, ITYPE } from './symbols.js'
import { type Prettify, type ExtractUndefined, type ExtractDefined } from '@poppinss/types'
import { type VineValidator } from './vine/validator.ts'
import { type VineObject } from './schema/object/main.ts'
import { type CamelCase } from './schema/camelcase_types.ts'
import { type JSONSchema7 } from 'json-schema'

/**
 * Compiler nodes emitted by Vine during schema compilation.
 * These nodes represent the structure of validation schemas and are used
 * by the compiler to generate optimized validation functions.
 *
 * @example
 * const node: CompilerNodes = {
 *   type: 'literal',
 *   subtype: 'string',
 *   propertyName: 'name',
 *   validations: []
 * }
 */
export type CompilerNodes = (
  | (LiteralNode & { subtype: string })
  | ObjectNode
  | ArrayNode
  | UnionNode
  | RecordNode
  | TupleNode
) & { jsonSchema: JSONSchema7 }

/**
 * Options accepted by the mobile number validation rule.
 * Combines locale-specific validation with additional phone number validation options.
 *
 * @example
 * const options: MobileOptions = {
 *   locale: ['en-US', 'en-GB'],
 *   strictMode: true
 * }
 */
export type MobileOptions = { locale?: MobilePhoneLocale[] } & IsMobilePhoneOptions

/**
 * Literal values that can be compared using strict equality (===).
 * These are primitive values used in literal schema validation and comparisons.
 *
 * @example
 * const value: Literal = 'hello'
 * const numberValue: Literal = 42
 * const boolValue: Literal = true
 */
export type Literal = string | number | bigint | boolean | null | undefined

/**
 * Options accepted by the email address validation rule.
 * Provides configuration for email validation behavior including domain restrictions,
 * allowlist/blocklist, and other email-specific validation options.
 *
 * @example
 * const options: EmailOptions = {
 *   allow_display_name: false,
 *   require_tld: true,
 *   host_blacklist: ['tempmail.com']
 * }
 */
export type EmailOptions = IsEmailOptions

/**
 * Options accepted by the normalize email transformation.
 * Controls how email addresses are normalized (e.g., removing dots from Gmail addresses).
 *
 * @example
 * const options: NormalizeEmailOptions = {
 *   gmail_remove_dots: true,
 *   gmail_remove_subaddress: true,
 *   lowercase: true
 * }
 */
export { NormalizeEmailOptions }

/**
 * Options accepted by the URL validation rule.
 * Configures URL validation behavior including protocol requirements,
 * domain validation, and other URL-specific options.
 *
 * @example
 * const options: URLOptions = {
 *   protocols: ['http', 'https'],
 *   require_protocol: true,
 *   require_valid_protocol: true
 * }
 */
export type URLOptions = IsURLOptions

/**
 * Options accepted by the credit card validation rule.
 * Specifies which credit card providers are accepted for validation.
 *
 * @example
 * const options: CreditCardOptions = {
 *   provider: ['visa', 'mastercard', 'amex']
 * }
 */
export type CreditCardOptions = {
  /** Array of accepted credit card providers */
  provider: ('amex' | 'dinersclub' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'visa')[]
}

/**
 * Options accepted by the passport validation rule.
 * Specifies which country codes are accepted for passport validation.
 *
 * @example
 * const options: PassportOptions = {
 *   countryCode: ['US', 'GB', 'CA']
 * }
 */
export type PassportOptions = {
  /** Array of accepted country codes for passport validation */
  countryCode: (typeof helpers)['passportCountryCodes'][number][]
}

/**
 * Options accepted by the postal code validation rule.
 * Specifies which country locales are used for postal code format validation.
 *
 * @example
 * const options: PostalCodeOptions = {
 *   countryCode: ['US', 'GB', 'CA']
 * }
 */
export type PostalCodeOptions = {
  /** Array of country codes for postal code validation */
  countryCode: PostalCodeLocale[]
}

/**
 * Options accepted by the VAT number validation rule.
 * Specifies which country codes are used for VAT number format validation.
 *
 * @example
 * const options: VATOptions = {
 *   countryCode: ['FR', 'CH', 'VE']
 * }
 */
export type VATOptions = {
  /** Array of country codes for VAT number validation */
  countryCode: VATCountryCode[]
}

/**
 * Options accepted by the alpha validation rule.
 * Controls which additional characters are allowed in alphabetic validation.
 *
 * @example
 * const options: AlphaOptions = {
 *   allowSpaces: true,
 *   allowUnderscores: false,
 *   allowDashes: true
 * }
 */
export type AlphaOptions = {
  /** Whether to allow space characters */
  allowSpaces?: boolean
  /** Whether to allow underscore characters */
  allowUnderscores?: boolean
  /** Whether to allow dash/hyphen characters */
  allowDashes?: boolean
}

/**
 * Options accepted by the normalize URL transformation.
 * Controls how URLs are normalized and standardized.
 *
 * @example
 * const options: NormalizeUrlOptions = {
 *   stripHash: true,
 *   stripWWW: false,
 *   removeTrailingSlash: true
 * }
 */
export type NormalizeUrlOptions = UrlOptions

/**
 * Options accepted by the alpha numeric validation rule.
 * Inherits options from AlphaOptions to control additional characters
 * allowed alongside alphanumeric characters.
 *
 * @example
 * const options: AlphaNumericOptions = {
 *   allowSpaces: true,
 *   allowUnderscores: true
 * }
 */
export type AlphaNumericOptions = AlphaOptions

/**
 * Re-exporting selected types from the Vine compiler.
 * These types are commonly used when working with validation schemas,
 * custom rules, and error reporting.
 *
 * @example
 * import type { FieldContext, MessagesProviderContact } from '@vinejs/vine'
 */
export type {
  /** Reference store for schema compilation */
  Refs,
  /** Context information for a field being validated */
  FieldContext,
  /** Identifier for schema references */
  RefIdentifier,
  /** Function for conditional validation logic */
  ConditionalFn,
  /** Contract for custom message providers */
  MessagesProviderContact,
} from '@vinejs/compiler/types'

/**
 * Representation of a native enum-like type.
 * Used for validating values against TypeScript enums or enum-like objects.
 *
 * @example
 * enum Status {
 *   ACTIVE = 'active',
 *   INACTIVE = 'inactive'
 * }
 * // Status satisfies EnumLike
 */
export type EnumLike = { [K: string]: string | number; [number: number]: string }

/**
 * Representation of validation error messages accepted by the messages provider.
 * Maps validation rule names to their corresponding error message templates.
 *
 * @example
 * const messages: ValidationMessages = {
 *   'required': 'The {{ field }} field is required',
 *   'email': 'The {{ field }} field must be a valid email'
 * }
 */
export type ValidationMessages = Record<string, string>

/**
 * Representation of field name mappings accepted by the messages provider.
 * Maps field paths to human-readable field names for error messages.
 *
 * @example
 * const fields: ValidationFields = {
 *   'user.email': 'Email Address',
 *   'user.name': 'Full Name'
 * }
 */
export type ValidationFields = Record<string, string>

/**
 * Base interface for all constructable schema types in Vine.
 * Defines the contract that all schema types must implement for type inference,
 * compilation, and validation.
 *
 * @template Inputs - The expected input type before validation
 * @template Output - The validated output type
 * @template CamelCaseOutput - The output type with camelCase field names
 *
 * @example
 * class StringSchema implements ConstructableSchema<string | undefined, string, string> {
 *   [ITYPE]: string | undefined
 *   [OTYPE]: string
 *   [COTYPE]: string
 *
 *   [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions) {
 *     return { type: 'literal', subtype: 'string' }
 *   }
 *
 *   clone() { return new StringSchema() }
 * }
 */
export interface ConstructableSchema<Inputs, Output, CamelCaseOutput> {
  /** Type marker for input type inference */
  [ITYPE]: Inputs
  /** Type marker for output type inference */
  [OTYPE]: Output
  /** Type marker for camelCase output type inference */
  [COTYPE]: CamelCaseOutput
  /** Compiles the schema into compiler nodes for validation */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes
  /** Creates a deep copy of the schema instance */
  clone(): this

  /**
   * Unique identifier for the schema type.
   * Implement if you want schema type to be used with unionOfTypes.
   */
  [UNIQUE_NAME]?: string
  /** Type checking function for union type resolution */
  [IS_OF_TYPE]?: (value: unknown, field: FieldContext) => boolean
}

/**
 * Specialized interface for literal schema types (string, number, boolean, etc.).
 * Extends ConstructableSchema but restricts the compiler output to literal nodes only.
 *
 * @template Inputs - The expected input type before validation
 * @template Output - The validated output type
 * @template CamelCaseOutput - The output type with camelCase field names
 *
 * @example
 * class NumberSchema implements ConstructableLiteralSchema<number | undefined, number, number> {
 *   [ITYPE]: number | undefined
 *   [OTYPE]: number
 *   [COTYPE]: number
 *
 *   [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions) {
 *     return { type: 'literal', subtype: 'number', propertyName, validations: [] }
 *   }
 *
 *   clone() { return new NumberSchema() }
 * }
 */
export interface ConstructableLiteralSchema<Inputs, Output, CamelCaseOutput> {
  /** Type marker for input type inference */
  [ITYPE]: Inputs
  /** Type marker for output type inference */
  [OTYPE]: Output
  /** Type marker for camelCase output type inference */
  [COTYPE]: CamelCaseOutput
  /** Compiles the schema into a literal compiler node */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string; jsonSchema: JSONSchema7 }
  /** Creates a deep copy of the schema instance */
  clone(): this

  /**
   * Unique identifier for the schema type.
   * Implement if you want schema type to be used with unionOfTypes.
   */
  [UNIQUE_NAME]?: string
  /** Type checking function for union type resolution */
  [IS_OF_TYPE]?: (value: unknown, field: FieldContext) => boolean
}

/**
 * Interface for schema types that support adding custom validation rules.
 * Provides a fluent API for chaining validation rules onto schema types.
 *
 * @example
 * const schema = vine.string()
 *   .use(minLength({ length: 5 }))
 *   .use(customRule({ option: 'value' }))
 */
export interface WithCustomRules {
  /**
   * Adds a validation rule to the schema's validation chain.
   * Rules are executed in the order they are added.
   *
   * @param validation - The validation rule or rule builder to add
   * @returns The schema instance for method chaining
   *
   * @example
   * schema.use(minLength({ length: 3 }))
   * schema.use(myCustomRule({ strict: true }))
   */
  use(validation: Validation<any> | RuleBuilder): this
}

/**
 * Union type representing all possible schema types in Vine.
 * Used as a constraint for generic functions that accept any schema type.
 *
 * @example
 * function validateSchema<T extends SchemaTypes>(schema: T, data: any) {
 *   // validation logic
 * }
 */
export type SchemaTypes = ConstructableSchema<any, any, any>

/**
 * Function signature for validation logic.
 * Validators receive the current field value, runtime options, and field context,
 * and either return a transformed value or throw an error for invalid input.
 *
 * @template Options - The type of options passed to the validator
 *
 * @param value - The current value being validated
 * @param options - Configuration options for the validation
 * @param field - Context information about the field being validated
 * @returns The validated/transformed value or a Promise resolving to it
 * @throws Should throw an error if validation fails
 *
 * @example
 * const minLengthValidator: Validator<{ length: number }> = (
 *   value,
 *   { length },
 *   field
 * ) => {
 *   if (typeof value === 'string' && value.length >= length) {
 *     return value
 *   }
 *   throw new Error(`Minimum length is ${length}`)
 * }
 */
export type Validator<Options extends any> = (
  value: unknown,
  options: Options,
  field: FieldContext
) => any | Promise<any>

export type JsonSchemaModifier<Options extends any> = (
  schema: JSONSchema7,
  options: Options
) => void

/**
 * A validation rule combines a validator function with metadata needed
 * for compilation and execution. This is the building block of all
 * validation logic in Vine.
 *
 * Think of this type as "Validator" + "metadata"
 *
 * @template Options - The type of options the validator accepts
 *
 * @example
 * const minLengthRule: ValidationRule<{ length: number }> = {
 *   validator: minLengthValidator,
 *   name: 'minLength',
 *   isAsync: false,
 *   implicit: false
 * }
 */
export type ValidationRule<Options extends any> = {
  /** The validation function to execute */
  validator: Validator<Options>
  /** Unique name for the validation rule */
  name: string
  /** Whether the validator returns a Promise */
  isAsync: boolean
  /** Whether the rule runs even when the field value is undefined/null */
  implicit: boolean
  toJSONSchema?: JsonSchemaModifier<Options>
}

/**
 * A validation combines a validation rule with specific options to be used
 * during field validation. This represents a configured validation ready for execution.
 *
 * Think of this type as "ValidationRule" + "runtime options"
 *
 * @template Options - The type of options for the validation rule
 *
 * @example
 * const validation: Validation<{ length: number }> = {
 *   rule: minLengthRule,
 *   options: { length: 5 }
 * }
 */
export type Validation<Options extends any> = {
  /**
   * Runtime options to pass to the validator function.
   * These options configure the specific behavior of the validation.
   */
  options?: Options

  /**
   * The validation rule to execute.
   */
  rule: ValidationRule<Options>
}

/**
 * Interface for rule builder objects that can be converted into validation rules.
 * Rule builders provide a fluent API for configuring validation rules before
 * converting them into executable validations.
 *
 * @example
 * class MinLengthBuilder implements RuleBuilder {
 *   constructor(private length: number) {}
 *
 *   [VALIDATION](): Validation<{ length: number }> {
 *     return {
 *       rule: minLengthRule,
 *       options: { length: this.length }
 *     }
 *   }
 * }
 */
export interface RuleBuilder {
  /**
   * Converts the rule builder into an executable validation.
   * This method is called internally when the rule is applied to a schema.
   */
  [VALIDATION](): Validation<any>
}

/**
 * Function type for transforming validated values after successful validation.
 * Transformers receive the validated value and return a modified version,
 * allowing for data manipulation like formatting, normalization, or type conversion.
 *
 * @template Schema - The schema type being transformed
 * @template Output - The type of the transformed output
 *
 * @example
 * const uppercaseTransformer: Transformer<StringSchema, string> = (value) => {
 *   return value.toUpperCase()
 * }
 */
export type Transformer<Schema extends SchemaTypes, Output> = TransformFn<
  Exclude<Schema[typeof OTYPE], undefined>,
  Output
>

/**
 * Function type for parsing/preprocessing input values before validation.
 * Parsers receive the raw input value and return a preprocessed version
 * that will then be validated by the schema.
 *
 * @example
 * const trimParser: Parser = (value) => {
 *   return typeof value === 'string' ? value.trim() : value
 * }
 */
export type Parser = ParseFn

/**
 * Configuration options for field validation behavior.
 * These options control how individual fields are processed during validation.
 *
 * @example
 * const options: FieldOptions = {
 *   allowNull: false,
 *   bail: true,
 *   isOptional: false,
 *   parse: trimParser
 * }
 */
export type FieldOptions = {
  /** Whether null values are allowed for this field */
  allowNull: boolean
  /** Whether to stop validation on first error */
  bail: boolean
  /** Whether the field is optional (can be undefined) */
  isOptional: boolean
  /** Optional parser to preprocess the input value */
  parse?: Parser
}

/**
 * Configuration options specific to date field validation.
 * Controls how date parsing and validation behaves.
 *
 * @example
 * const options: DateFieldOptions = {
 *   formats: ['YYYY-MM-DD', 'MM/DD/YYYY']
 * }
 */
export type DateFieldOptions = {
  /** Accepted date formats for parsing */
  formats?: dayjs.OptionType
}

/**
 * Options for the date equals validation rule.
 * Controls how date equality comparison is performed.
 *
 * @example
 * const options: DateEqualsOptions = {
 *   compare: 'day', // Compare only the day part
 *   format: 'YYYY-MM-DD'
 * }
 */
export type DateEqualsOptions = {
  /** The unit of time to use for comparison (year, month, day, etc.) */
  compare?: dayjs.OpUnitType
  /** The date format to use for parsing the comparison value */
  format?: dayjs.OptionType
}

/**
 * Options that control schema compilation behavior.
 * These options affect how schemas are transformed into validation functions.
 *
 * @example
 * const options: ParserOptions = {
 *   toCamelCase: true // Convert field names to camelCase
 * }
 */
export type ParserOptions = {
  /** Whether to convert object field names to camelCase in the output */
  toCamelCase: boolean
}

/**
 * Callback function invoked when a union schema cannot match any of its variants.
 * Allows for custom error handling or fallback logic when union validation fails.
 *
 * @template Input - The type of the input value
 *
 * @param value - The input value that couldn't be matched
 * @param field - Context information about the field being validated
 * @returns Custom error or fallback value
 *
 * @example
 * const noMatchCallback: UnionNoMatchCallback<unknown> = (value, field) => {
 *   throw new Error(`No union variant matched for field ${field.name}`)
 * }
 */
export type UnionNoMatchCallback<Input> = (value: Input, field: FieldContext) => any

/**
 * Structure of validation errors as collected by the SimpleErrorReporter.
 * Each error provides comprehensive information about validation failures
 * including the error message, field location, and additional context.
 *
 * @example
 * const error: SimpleError = {
 *   message: 'The email field must be a valid email address',
 *   field: 'user.email',
 *   rule: 'email',
 *   meta: { value: 'invalid-email' }
 * }
 */
export type SimpleError = {
  /** The human-readable error message */
  message: string
  /** The field path where the error occurred (dot notation) */
  field: string
  /** The name of the validation rule that failed */
  rule: string
  /** The array index if this error is for an array element */
  index?: number
  /** Additional metadata about the error (e.g., attempted value, rule options) */
  meta?: Record<string, any>
}

/**
 * Contract interface that all error reporters must implement.
 * Error reporters are responsible for collecting validation errors
 * and formatting them into appropriate error objects.
 *
 * @example
 * class CustomErrorReporter implements ErrorReporterContract {
 *   report(message: string, rule: string, field: FieldContext) {
 *     // Custom error reporting logic
 *   }
 *
 *   createError(): ValidationError {
 *     return new ValidationError(this.getErrors())
 *   }
 * }
 */
export interface ErrorReporterContract extends BaseReporter {
  /**
   * Creates a ValidationError instance from collected errors.
   * Called after all validation errors have been reported.
   */
  createError(): ValidationError
}

/**
 * Function type for validating metadata passed to validation pipelines.
 * Metadata validators can enforce constraints on additional context data
 * passed during validation (e.g., user permissions, request context).
 *
 * @param meta - The metadata object to validate
 * @throws Should throw an error if metadata is invalid
 *
 * @example
 * const metaValidator: MetaDataValidator = (meta) => {
 *   if (!meta.userId || typeof meta.userId !== 'string') {
 *     throw new Error('userId is required in metadata')
 *   }
 * }
 */
export type MetaDataValidator = (meta: Record<string, any>) => void

type BaseValidationTypes = {
  /**
   * Custom messages provider for internationalization and error message customization.
   * If not provided, the default messages provider will be used.
   */
  messagesProvider?: MessagesProviderContact
  /**
   * Factory function for creating error reporters.
   * Error reporters control how validation errors are collected and formatted.
   */
  errorReporter?: () => ErrorReporterContract
}

type ValidationOptionsMetaProp<MetaData extends Record<string, any> | undefined> = [
  undefined,
] extends MetaData
  ? {
      /** Optional metadata to pass to validators for additional context */
      meta?: MetaData
    }
  : {
      /** Required metadata to pass to validators for additional context */
      meta: MetaData
    }

/**
 * Configuration options for validation operations.
 * Controls how validation is performed, how errors are reported,
 * and provides additional context through metadata.
 *
 * @template MetaData - Type of metadata passed to the validator
 *
 * @example
 * const options: ValidationOptions<{ userId: string }> = {
 *   messagesProvider: customMessagesProvider,
 *   errorReporter: () => new CustomErrorReporter(),
 *   meta: { userId: '123' }
 * }
 */
export type ValidationOptions<MetaData extends Record<string, any> | undefined> =
  BaseValidationTypes & ValidationOptionsMetaProp<MetaData>

export type Infer<Schema extends { [OTYPE]: any }> = Schema[typeof OTYPE]

export interface ValidatorBuilder<MetaData extends Record<string, any>> {
  /**
   * @deprecated Instead use "create"
   */
  compile<Schema extends SchemaTypes>(schema: Schema): VineValidator<Schema, MetaData>
  create<
    Properties extends Record<string, SchemaTypes>,
    Schema extends VineObject<
      Properties,
      UndefinedOptional<{
        [K in keyof Properties]: Properties[K][typeof ITYPE]
      }>,
      UndefinedOptional<{
        [K in keyof Properties]: Properties[K][typeof OTYPE]
      }>,
      UndefinedOptional<{
        [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
      }>
    >,
  >(
    properties: Properties
  ): VineValidator<Schema, MetaData>
  create<Schema extends SchemaTypes>(schema: Schema): VineValidator<Schema, MetaData>
}

/**
 * Utility type to infer the input type of a schema.
 * Extracts the expected input type before validation and transformation.
 *
 * @template Schema - The schema to infer the input type from
 *
 * @example
 * const schema = vine.string().optional()
 *
 * type Input = InferInput<typeof schema>
 * // type Input = string | undefined
 */
export type InferInput<Schema extends { [ITYPE]: any }> = Schema[typeof ITYPE]

/**
 * Numeric comparison operators for conditional validation rules.
 * Used in rules like requiredWhen to compare numeric values.
 */
export type NumericComparisonOperators = '>' | '<' | '>=' | '<='

/**
 * Array-based comparison operators for conditional validation rules.
 * Used to check if values are present in or absent from arrays.
 */
export type ArrayComparisonOperators = 'in' | 'notIn'

/**
 * All supported comparison operators for conditional validation rules.
 * Combines numeric, array, and equality operators for flexible comparisons.
 *
 * @example
 * // Using with requiredWhen
 * vine.string().requiredWhen('age', '>', 18)
 * vine.string().requiredWhen('role', 'in', ['admin', 'moderator'])
 * vine.string().requiredWhen('status', '=', 'active')
 */
export type ComparisonOperators = ArrayComparisonOperators | NumericComparisonOperators | '=' | '!='

/**
 * Utility type that makes properties with undefined values optional.
 * Transforms properties that allow undefined into truly optional properties,
 * improving the developer experience by not requiring explicit undefined values.
 *
 * @template T - The type to transform
 *
 * @example
 * type Before = { name: string; age?: number | undefined }
 * type After = UndefinedOptional<Before>
 * // After = { name: string; age?: number }
 */
export type UndefinedOptional<T> = Prettify<
  {
    [K in ExtractUndefined<T>]?: T[K]
  } & {
    [K in ExtractDefined<T>]: T[K]
  }
>

/**
 * Utility type to convert object with schema properties to optional schemas.
 *
 * @template T - Record of property names to their schema types
 */
export type PropertiesToOptional<T extends Record<string, SchemaTypes>> = {
  [K in keyof T]: T[K] extends { optional: () => infer R extends SchemaTypes } ? R : T[K]
}

/**
 * A container to define global transforms for certain data-types. Currently
 * only date global transform can be defined
 */
export interface VineGlobalTransforms {}
