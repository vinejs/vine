/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'
import type {
  Validation,
  AlphaOptions,
  FieldContext,
  FieldOptions,
  AlphaNumericOptions,
  NormalizeEmailOptions,
} from '../../types.js'

import {
  inRule,
  urlRule,
  jwtRule,
  uuidRule,
  ulidRule,
  trimRule,
  ibanRule,
  alphaRule,
  emailRule,
  notInRule,
  asciiRule,
  regexRule,
  sameAsRule,
  mobileRule,
  escapeRule,
  stringRule,
  hexCodeRule,
  passportRule,
  endsWithRule,
  ipAddressRule,
  confirmedRule,
  notSameAsRule,
  activeUrlRule,
  minLengthRule,
  maxLengthRule,
  startsWithRule,
  creditCardRule,
  postalCodeRule,
  fixedLengthRule,
  coordinatesRule,
  toUpperCaseRule,
  toLowerCaseRule,
  toCamelCaseRule,
  normalizeUrlRule,
  alphaNumericRule,
  normalizeEmailRule,
  vatRule,
} from './rules.js'

/**
 * VineString represents a string value in the validation schema.
 * It provides comprehensive string validation with built-in rules
 * for common patterns like email, URL, UUID, and more.
 *
 * @example
 * const schema = vine.string()
 *   .email()
 *   .minLength(5)
 *   .maxLength(100)
 *
 * const result = await vine.validate({
 *   schema,
 *   data: 'user@example.com'
 * })
 */
export class VineString extends BaseLiteralType<string, string, string> {
  /**
   * Static collection of all available validation rules for strings
   */
  static rules = {
    in: inRule,
    jwt: jwtRule,
    url: urlRule,
    iban: ibanRule,
    uuid: uuidRule,
    ulid: ulidRule,
    trim: trimRule,
    email: emailRule,
    alpha: alphaRule,
    ascii: asciiRule,
    notIn: notInRule,
    regex: regexRule,
    escape: escapeRule,
    sameAs: sameAsRule,
    mobile: mobileRule,
    string: stringRule,
    hexCode: hexCodeRule,
    passport: passportRule,
    endsWith: endsWithRule,
    confirmed: confirmedRule,
    activeUrl: activeUrlRule,
    minLength: minLengthRule,
    notSameAs: notSameAsRule,
    maxLength: maxLengthRule,
    vat: vatRule,
    ipAddress: ipAddressRule,
    creditCard: creditCardRule,
    postalCode: postalCodeRule,
    startsWith: startsWithRule,
    toUpperCase: toUpperCaseRule,
    toLowerCase: toLowerCaseRule,
    toCamelCase: toCamelCaseRule,
    fixedLength: fixedLengthRule,
    coordinates: coordinatesRule,
    normalizeUrl: normalizeUrlRule,
    alphaNumeric: alphaNumericRule,
    normalizeEmail: normalizeEmailRule,
  };

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'string';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.string';

  /**
   * Type checker function to determine if a value is a string.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is a string
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string'
  }

  /**
   * Creates a new VineString instance with optional configuration.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = stringRule()
  }

  /**
   * Validates the value to be a valid URL.
   *
   * @param args - Optional URL validation options
   * @returns This string schema instance for method chaining
   */
  url(...args: Parameters<typeof urlRule>) {
    return this.use(urlRule(...args))
  }

  /**
   * Validates the value to be an active URL by making an HTTP request.
   *
   * @returns This string schema instance for method chaining
   */
  activeUrl() {
    return this.use(activeUrlRule())
  }

  /**
   * Validates the value to be a valid email address.
   *
   * @param args - Optional email validation options
   * @returns This string schema instance for method chaining
   */
  email(...args: Parameters<typeof emailRule>) {
    return this.use(emailRule(...args))
  }

  /**
   * Validates the value to be a valid mobile phone number for specified locales.
   *
   * @param options - Optional mobile validation options including locale and strictMode
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().mobile({ locale: ['en-US', 'en-GB'] })
   */
  mobile(...args: Parameters<typeof mobileRule>) {
    return this.use(mobileRule(...args))
  }

  /**
   * Validates the value to be a valid VAT (Value Added Tax) number for specified countries.
   *
   * @param options - VAT validation options including country codes
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().vat({ countryCode: ['FR', 'CH', 'VE'] })
   */
  vat(...args: Parameters<typeof vatRule>) {
    return this.use(vatRule(...args))
  }

  /**
   * Validates the value to be a valid IP address (IPv4 or IPv6).
   *
   * @param version - Optional IP version (4 for IPv4, 6 for IPv6). Omit to allow both.
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().ipAddress()     // Allows IPv4 and IPv6
   * vine.string().ipAddress(4)    // Only IPv4
   * vine.string().ipAddress(6)    // Only IPv6
   */
  ipAddress(version?: 4 | 6) {
    return this.use(ipAddressRule(version ? { version } : undefined))
  }

  /**
   * Validates the value to be a valid hexadecimal color code.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().hexCode()  // Accepts #FFF, #FFFFFF, etc.
   */
  hexCode() {
    return this.use(hexCodeRule())
  }

  /**
   * Validates the value against a custom regular expression pattern.
   *
   * @param expression - The regular expression to match against
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().regex(/^[A-Z]{3}\d{3}$/)  // Matches ABC123 pattern
   */
  regex(expression: RegExp) {
    return this.use(regexRule(expression))
  }

  /**
   * Validates the value to contain only alphabetic characters.
   *
   * @param options - Options to allow spaces, underscores, or dashes
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().alpha()
   * vine.string().alpha({ allowSpaces: true })
   * vine.string().alpha({ allowSpaces: true, allowDashes: true })
   */
  alpha(options?: AlphaOptions) {
    return this.use(alphaRule(options))
  }

  /**
   * Validates the value to contain only alphanumeric characters (letters and numbers).
   *
   * @param options - Options to allow spaces, underscores, or dashes
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().alphaNumeric()
   * vine.string().alphaNumeric({ allowSpaces: true, allowUnderscores: true })
   */
  alphaNumeric(options?: AlphaNumericOptions) {
    return this.use(alphaNumericRule(options))
  }

  /**
   * Enforce a minimum length on a string field.
   *
   * @param expectedLength - The minimum required length
   * @returns This string schema instance for method chaining
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum length on a string field.
   *
   * @param expectedLength - The maximum allowed length
   * @returns This string schema instance for method chaining
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce a fixed length on a string field.
   *
   * @param expectedLength - The exact required length
   * @returns This string schema instance for method chaining
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Ensures the field is confirmed by having another field with "_confirmation" suffix
   * (or a custom suffix). Useful for password confirmation fields.
   *
   * @param options - Optional configuration for the confirmation field name
   * @returns This string schema instance for method chaining
   *
   * @example
   * // Validates that "password_confirmation" field matches "password"
   * vine.string().confirmed()
   *
   * @example
   * // Custom confirmation field name
   * vine.string().confirmed({ as: 'passwordConfirm' })
   */
  confirmed(
    options?:
      | {
          /**
           * @deprecated
           * Use "as" field instead
           */
          confirmationField?: string
        }
      | {
          as?: string
        }
  ) {
    return this.use(confirmedRule(options))
  }

  /**
   * Trims leading and trailing whitespace from the string value.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().trim()  // "  hello  " becomes "hello"
   */
  trim() {
    return this.use(trimRule())
  }

  /**
   * Normalizes the email address by applying transformations like
   * lowercasing and removing dots from Gmail addresses.
   *
   * @param options - Email normalization options
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().email().normalizeEmail({ gmail_remove_dots: true })
   */
  normalizeEmail(options?: NormalizeEmailOptions) {
    return this.use(normalizeEmailRule(options))
  }

  /**
   * Converts the field value to UPPERCASE.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().toUpperCase()  // "hello" becomes "HELLO"
   */
  toUpperCase() {
    return this.use(toUpperCaseRule())
  }

  /**
   * Converts the field value to lowercase.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().toLowerCase()  // "HELLO" becomes "hello"
   */
  toLowerCase() {
    return this.use(toLowerCaseRule())
  }

  /**
   * Converts the field value to camelCase.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().toCamelCase()  // "hello_world" becomes "helloWorld"
   */
  toCamelCase() {
    return this.use(toCamelCaseRule())
  }

  /**
   * Escapes HTML entities in the string to prevent XSS attacks.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().escape()  // "<script>" becomes "&lt;script&gt;"
   */
  escape() {
    return this.use(escapeRule())
  }

  /**
   * Normalizes a URL by applying standardization rules like removing trailing slashes,
   * sorting query parameters, and stripping default ports.
   *
   * @param options - URL normalization options
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().url().normalizeUrl({ stripWWW: true })
   */
  normalizeUrl(...args: Parameters<typeof normalizeUrlRule>) {
    return this.use(normalizeUrlRule(...args))
  }

  /**
   * Ensures the value starts with a specified substring.
   *
   * @param substring - The required starting substring
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().startsWith('https://')
   */
  startsWith(substring: string) {
    return this.use(startsWithRule({ substring }))
  }

  /**
   * Ensures the value ends with a specified substring.
   *
   * @param substring - The required ending substring
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().endsWith('.com')
   */
  endsWith(substring: string) {
    return this.use(endsWithRule({ substring }))
  }

  /**
   * Ensures the value matches the value of another field in the data.
   *
   * @param otherField - The name of the field to compare with
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().sameAs('password')
   */
  sameAs(otherField: string) {
    return this.use(sameAsRule({ otherField }))
  }

  /**
   * Ensures the value does not match the value of another field in the data.
   *
   * @param otherField - The name of the field to compare with
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().notSameAs('oldPassword')
   */
  notSameAs(otherField: string) {
    return this.use(notSameAsRule({ otherField }))
  }

  /**
   * Ensures the field's value is one of the predefined choices.
   *
   * @param choices - Array of allowed values or function returning allowed values
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().in(['red', 'green', 'blue'])
   *
   * @example
   * // Dynamic choices based on metadata
   * vine.string().in((field) => getUserRoles(field.meta.userId))
   */
  in(choices: string[] | ((field: FieldContext) => string[])) {
    return this.use(inRule({ choices }))
  }

  /**
   * Ensures the field's value is not in the predefined list.
   *
   * @param list - Array of disallowed values or function returning disallowed values
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().notIn(['admin', 'root', 'system'])
   */
  notIn(list: string[] | ((field: FieldContext) => string[])) {
    return this.use(notInRule({ list }))
  }

  /**
   * Validates the value to be a valid credit card number for specified providers.
   *
   * @param options - Credit card validation options including accepted providers
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().creditCard({ provider: ['visa', 'mastercard'] })
   */
  creditCard(...args: Parameters<typeof creditCardRule>) {
    return this.use(creditCardRule(...args))
  }

  /**
   * Validates the value to be a valid passport number for specified countries.
   *
   * @param options - Passport validation options including country codes
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().passport({ countryCode: ['US', 'GB', 'CA'] })
   */
  passport(...args: Parameters<typeof passportRule>) {
    return this.use(passportRule(...args))
  }

  /**
   * Validates the value to be a valid postal code for specified countries.
   *
   * @param options - Postal code validation options including country codes
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().postalCode({ countryCode: ['US', 'GB', 'CA'] })
   */
  postalCode(...args: Parameters<typeof postalCodeRule>) {
    return this.use(postalCodeRule(...args))
  }

  /**
   * Validates the value to be a valid UUID (Universally Unique Identifier).
   *
   * @param options - Optional UUID validation options including version
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().uuid()
   * vine.string().uuid({ version: 4 })
   */
  uuid(...args: Parameters<typeof uuidRule>) {
    return this.use(uuidRule(...args))
  }

  /**
   * Validates the value to be a valid ULID (Universally Unique Lexicographically Sortable Identifier).
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().ulid()
   */
  ulid() {
    return this.use(ulidRule())
  }

  /**
   * Validates the value contains only ASCII characters.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().ascii()
   */
  ascii() {
    return this.use(asciiRule())
  }

  /**
   * Validates the value to be a valid IBAN (International Bank Account Number).
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().iban()
   */
  iban() {
    return this.use(ibanRule())
  }

  /**
   * Validates the value to be a valid JWT (JSON Web Token).
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().jwt()
   */
  jwt() {
    return this.use(jwtRule())
  }

  /**
   * Validates the value to be a string containing latitude and longitude coordinates.
   *
   * @returns This string schema instance for method chaining
   *
   * @example
   * vine.string().coordinates()  // Accepts "40.7128,-74.0060"
   */
  coordinates() {
    return this.use(coordinatesRule())
  }

  /**
   * Clones the VineString schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineString schema
   */
  clone(): this {
    return new VineString(this.cloneOptions(), this.cloneValidations()) as this
  }
}
