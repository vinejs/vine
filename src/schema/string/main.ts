/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, UNIQUE_NAME } from '../../symbols.js'
import type {
  Validation,
  AlphaOptions,
  FieldOptions,
  AlphaNumericOptions,
  NormalizeEmailOptions,
} from '../../types.js'

import {
  urlRule,
  alphaRule,
  emailRule,
  regexRule,
  mobileRule,
  stringRule,
  hexCodeRule,
  confirmedRule,
  activeUrlRule,
  minLengthRule,
  maxLengthRule,
  fixedLengthRule,
  alphaNumericRule,
  trimRule,
  normalizeEmailRule,
  endsWithRule,
  startsWithRule,
} from './rules.js'

/**
 * VineString represents a string value in the validation schema.
 */
export class VineString extends BaseLiteralType<string, string> {
  static rules = {
    url: urlRule,
    trim: trimRule,
    email: emailRule,
    alpha: alphaRule,
    regex: regexRule,
    string: stringRule,
    mobile: mobileRule,
    hexCode: hexCodeRule,
    endsWith: endsWithRule,
    confirmed: confirmedRule,
    activeUrl: activeUrlRule,
    minLength: minLengthRule,
    maxLength: maxLengthRule,
    startsWith: startsWithRule,
    fixedLength: fixedLengthRule,
    alphaNumeric: alphaNumericRule,
    normalizeEmail: normalizeEmailRule,
  };

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.string';

  /**
   * Checks if the value is of string type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string'
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [stringRule()])
  }

  /**
   * Validates the value to be a valid URL
   */
  url(...args: Parameters<typeof urlRule>) {
    return this.use(urlRule(...args))
  }

  /**
   * Validates the value to be an active URL
   */
  activeUrl() {
    return this.use(activeUrlRule())
  }

  /**
   * Validates the value to be a valid email address
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
   * Validates the value to be a valid hex color code
   */
  hexCode() {
    return this.use(hexCodeRule())
  }

  /**
   * Validates the value to be an active URL
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
   * Enforce a minimum length on a string field
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum length on a string field
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce a fixed length on a string field
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Ensure the field under validation is confirmed by
   * having another field with the same name.
   */
  confirmed(options?: { confirmationField: string }) {
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
   * Clones the VineString schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineString(this.cloneOptions(), this.cloneValidations()) as this
  }
}
