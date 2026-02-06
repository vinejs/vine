/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.ts'
import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'
import {
  dateRule,
  afterRule,
  beforeRule,
  sameAsRule,
  equalsRule,
  weekendRule,
  weekdayRule,
  notSameAsRule,
  afterFieldRule,
  beforeFieldRule,
  afterOrEqualRule,
  afterOrSameAsRule,
  beforeOrEqualRule,
  beforeOrSameAsRule,
} from './rules.js'
import type {
  Validation,
  FieldOptions,
  FieldContext,
  DateFieldOptions,
  DateEqualsOptions,
  VineGlobalTransforms,
} from '../../types.js'
import { globalTransforms } from '../../defaults.ts'

/**
 * VineDate represents a Date object created by parsing a string or number value as a date.
 * It accepts various date formats and converts them to JavaScript Date objects,
 * with comprehensive validation rules for date comparisons and ranges.
 *
 * @example
 * const schema = vine.date()
 *   .after('today')
 *   .before('2025-12-31')
 *
 * const result = await vine.validate({
 *   schema,
 *   data: '2025-06-15'
 * })
 */
export class VineDate extends BaseLiteralType<
  string | number,
  VineGlobalTransforms extends { date: infer D } ? D : Date,
  VineGlobalTransforms extends { date: infer D } ? D : Date
> {
  /**
   * Sets a global transformer function for all date values.
   * The transformer is applied to every validated date value.
   *
   * @param transformer - Function that transforms a Date object to a custom type
   *
   * @example
   * VineDate.transform((value) => value.toISOString())
   */
  static transform(
    transformer: (value: Date) => VineGlobalTransforms extends { date: infer D } ? D : Date
  ) {
    globalTransforms.date = transformer
  }

  /**
   * Static collection of all available validation rules for dates
   */
  static rules = {
    equals: equalsRule,
    after: afterRule,
    afterOrEqual: afterOrEqualRule,
    before: beforeRule,
    beforeOrEqual: beforeOrEqualRule,
    sameAs: sameAsRule,
    notSameAs: notSameAsRule,
    afterField: afterFieldRule,
    afterOrSameAs: afterOrSameAsRule,
    beforeField: beforeFieldRule,
    beforeOrSameAs: beforeOrSameAsRule,
    weekend: weekendRule,
    weekday: weekdayRule,
  };

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.date';

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'date';

  /**
   * Type checker function to determine if a value can be parsed as a date.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value can be parsed as a valid date
   */
  [IS_OF_TYPE] = (value: unknown) => {
    if (typeof value !== 'string') {
      return false
    }
    return helpers.asDayJS(value, this.options.formats).dateTime.isValid()
  }

  declare options: FieldOptions & DateFieldOptions

  /**
   * Creates a new VineDate instance with optional configuration.
   *
   * @param options - Field options including date formats and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions> & DateFieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = dateRule(options || {})
  }

  /**
   * Validates the date to be equal to the expected value.
   * By default, compares day, month, and year.
   *
   * @param expectedValue - The expected date value or 'today'
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().equals('2025-01-01')
   * vine.date().equals('today')
   * vine.date().equals('2025-01-01', { compare: 'month' })
   */
  equals(
    expectedValue: string | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(equalsRule({ expectedValue, ...options }))
  }

  /**
   * Validates the date to be after the expected value.
   * By default, compares day, month, and year.
   *
   * @param expectedValue - The expected date value, 'today', or 'tomorrow'
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().after('today')
   * vine.date().after('2025-01-01')
   * vine.date().after('tomorrow', { compare: 'hour' })
   */
  after(
    expectedValue:
      | 'today'
      | 'tomorrow'
      | (string & { _?: never })
      | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(afterRule({ expectedValue, ...options }))
  }

  /**
   * Validates the date to be after or equal to the expected value.
   * By default, compares day, month, and year.
   *
   * @param expectedValue - The expected date value, 'today', or 'tomorrow'
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().afterOrEqual('today')
   * vine.date().afterOrEqual('2025-01-01')
   */
  afterOrEqual(
    expectedValue:
      | 'today'
      | 'tomorrow'
      | (string & { _?: never })
      | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(afterOrEqualRule({ expectedValue, ...options }))
  }

  /**
   * Validates the date to be before the expected value.
   * By default, compares day, month, and year.
   *
   * @param expectedValue - The expected date value, 'today', or 'yesterday'
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().before('today')
   * vine.date().before('2025-12-31')
   * vine.date().before('yesterday')
   */
  before(
    expectedValue:
      | 'today'
      | 'yesterday'
      | (string & { _?: never })
      | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(beforeRule({ expectedValue, ...options }))
  }

  /**
   * Validates the date to be before or equal to the expected value.
   * By default, compares day, month, and year.
   *
   * @param expectedValue - The expected date value, 'today', or 'yesterday'
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().beforeOrEqual('today')
   * vine.date().beforeOrEqual('2025-12-31')
   */
  beforeOrEqual(
    expectedValue:
      | 'today'
      | 'yesterday'
      | (string & { _?: never })
      | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(beforeOrEqualRule({ expectedValue, ...options }))
  }

  /**
   * Validates the date to be equal to another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().sameAs('startDate')
   * vine.date().sameAs('birthDate', { compare: 'month' })
   */
  sameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(sameAsRule({ otherField, ...options }))
  }

  /**
   * Validates the date to be different from another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().notSameAs('endDate')
   * vine.date().notSameAs('previousDate')
   */
  notSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(notSameAsRule({ otherField, ...options }))
  }

  /**
   * Validates the date to be after another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().afterField('startDate')
   * vine.date().afterField('createdAt', { compare: 'minute' })
   */
  afterField(otherField: string, options?: DateEqualsOptions): this {
    return this.use(afterFieldRule({ otherField, ...options }))
  }

  /**
   * Validates the date to be after or equal to another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().afterOrSameAs('startDate')
   */
  afterOrSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(afterOrSameAsRule({ otherField, ...options }))
  }

  /**
   * Validates the date to be before another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().beforeField('endDate')
   * vine.date().beforeField('expiresAt')
   */
  beforeField(otherField: string, options?: DateEqualsOptions): this {
    return this.use(beforeFieldRule({ otherField, ...options }))
  }

  /**
   * Validates the date to be before or equal to another field's value.
   * By default, compares day, month, and year.
   *
   * @param otherField - The name of the other field to compare with
   * @param options - Comparison options (compare unit and format)
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().beforeOrSameAs('endDate')
   */
  beforeOrSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(beforeOrSameAsRule({ otherField, ...options }))
  }

  /**
   * Validates the date to fall on a weekend (Saturday or Sunday).
   *
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().weekend()
   */
  weekend(): this {
    return this.use(weekendRule())
  }

  /**
   * Validates the date to fall on a weekday (Monday to Friday).
   *
   * @returns This date schema instance for method chaining
   *
   * @example
   * vine.date().weekday()
   */
  weekday(): this {
    return this.use(weekdayRule())
  }

  /**
   * Clones the VineDate schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineDate schema
   */
  clone(): this {
    return new VineDate(this.cloneOptions(), this.cloneValidations()) as this
  }
}
