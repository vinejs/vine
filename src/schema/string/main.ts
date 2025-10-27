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
   * Validates the value to be a valid mobile number
   */
  mobile(...args: Parameters<typeof mobileRule>) {
    return this.use(mobileRule(...args))
  }

  /**
   * Validates the value to be a valid IP address.
   */
  ipAddress(version?: 4 | 6) {
    return this.use(ipAddressRule(version ? { version } : undefined))
  }

  /**
   * Validates the value to be a valid hex color code
   */
  hexCode() {
    return this.use(hexCodeRule())
  }

  /**
   * Validates the value against a regular expression
   */
  regex(expression: RegExp) {
    return this.use(regexRule(expression))
  }

  /**
   * Validates the value to contain only letters
   */
  alpha(options?: AlphaOptions) {
    return this.use(alphaRule(options))
  }

  /**
   * Validates the value to contain only letters and
   * numbers
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
   * Ensure the field under validation is confirmed by
   * having another field with the same name.
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
   * Trims whitespaces around the string value
   */
  trim() {
    return this.use(trimRule())
  }

  /**
   * Normalizes the email address
   */
  normalizeEmail(options?: NormalizeEmailOptions) {
    return this.use(normalizeEmailRule(options))
  }

  /**
   * Converts the field value to UPPERCASE.
   */
  toUpperCase() {
    return this.use(toUpperCaseRule())
  }

  /**
   * Converts the field value to lowercase.
   */
  toLowerCase() {
    return this.use(toLowerCaseRule())
  }

  /**
   * Converts the field value to camelCase.
   */
  toCamelCase() {
    return this.use(toCamelCaseRule())
  }

  /**
   * Escape string for HTML entities
   */
  escape() {
    return this.use(escapeRule())
  }

  /**
   * Normalize a URL
   */
  normalizeUrl(...args: Parameters<typeof normalizeUrlRule>) {
    return this.use(normalizeUrlRule(...args))
  }

  /**
   * Ensure the value starts with the pre-defined substring
   */
  startsWith(substring: string) {
    return this.use(startsWithRule({ substring }))
  }

  /**
   * Ensure the value ends with the pre-defined substring
   */
  endsWith(substring: string) {
    return this.use(endsWithRule({ substring }))
  }

  /**
   * Ensure the value ends with the pre-defined substring
   */
  sameAs(otherField: string) {
    return this.use(sameAsRule({ otherField }))
  }

  /**
   * Ensure the value ends with the pre-defined substring
   */
  notSameAs(otherField: string) {
    return this.use(notSameAsRule({ otherField }))
  }

  /**
   * Ensure the field's value under validation is a subset of the pre-defined list.
   */
  in(choices: string[] | ((field: FieldContext) => string[])) {
    return this.use(inRule({ choices }))
  }

  /**
   * Ensure the field's value under validation is not inside the pre-defined list.
   */
  notIn(list: string[] | ((field: FieldContext) => string[])) {
    return this.use(notInRule({ list }))
  }

  /**
   * Validates the value to be a valid credit card number
   */
  creditCard(...args: Parameters<typeof creditCardRule>) {
    return this.use(creditCardRule(...args))
  }

  /**
   * Validates the value to be a valid passport number
   */
  passport(...args: Parameters<typeof passportRule>) {
    return this.use(passportRule(...args))
  }

  /**
   * Validates the value to be a valid postal code
   */
  postalCode(...args: Parameters<typeof postalCodeRule>) {
    return this.use(postalCodeRule(...args))
  }

  /**
   * Validates the value to be a valid UUID
   */
  uuid(...args: Parameters<typeof uuidRule>) {
    return this.use(uuidRule(...args))
  }

  /**
   * Validates the value to be a valid ULID
   */
  ulid() {
    return this.use(ulidRule())
  }

  /**
   * Validates the value contains ASCII characters only
   */
  ascii() {
    return this.use(asciiRule())
  }

  /**
   * Validates the value to be a valid IBAN number
   */
  iban() {
    return this.use(ibanRule())
  }

  /**
   * Validates the value to be a valid JWT token
   */

  jwt() {
    return this.use(jwtRule())
  }

  /**
   * Ensure the value is a string with latitude and longitude coordinates
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
