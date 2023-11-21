/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dayjs from 'dayjs'
import { BaseLiteralType } from '../base/literal.js'
import { IS_OF_TYPE, UNIQUE_NAME } from '../../symbols.js'
import {
  dateRule,
  afterRule,
  beforeRule,
  sameAsRule,
  equalsRule,
  notSameAsRule,
  afterFieldRule,
  beforeFieldRule,
  afterOrEqualRule,
  afterOrSameAsRule,
  beforeOrEqualRule,
  beforeOrSameAsRule,
  DEFAULT_DATE_FORMATS,
} from './rules.js'
import type {
  Validation,
  FieldOptions,
  FieldContext,
  DateFieldOptions,
  DateEqualsOptions,
} from '../../types.js'

/**
 * VineDate represents a Date object created by parsing a
 * string or number value as a date.
 */
export class VineDate extends BaseLiteralType<Date, Date> {
  /**
   * Available VineDate rules
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
  };

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.date';

  /**
   * Checks if the value is of date type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    if (typeof value !== 'string') {
      return false
    }

    return dayjs(value, this.options.formats || DEFAULT_DATE_FORMATS, true).isValid()
  }

  protected declare options: FieldOptions & DateFieldOptions

  constructor(options?: Partial<FieldOptions> & DateFieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [dateRule(options || {})])
  }

  /**
   * The equals rule compares the input value to be same
   * as the expected value.
   *
   * By default, the comparions of day, month and years are performed.
   */
  equals(
    expectedValue: string | ((field: FieldContext) => string),
    options?: DateEqualsOptions
  ): this {
    return this.use(equalsRule({ expectedValue, ...options }))
  }

  /**
   * The after rule compares the input value to be after
   * the expected value.
   *
   * By default, the comparions of day, month and years are performed.
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
   * The after or equal rule compares the input value to be
   * after or equal to the expected value.
   *
   * By default, the comparions of day, month and years are performed.
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
   * The before rule compares the input value to be before
   * the expected value.
   *
   * By default, the comparions of day, month and years are performed.
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
   * The before rule compares the input value to be before
   * the expected value.
   *
   * By default, the comparions of day, month and years are performed.
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
   * The sameAs rule expects the input value to be same
   * as the value of the other field.
   *
   * By default, the comparions of day, month and years are performed
   */
  sameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(sameAsRule({ otherField, ...options }))
  }

  /**
   * The notSameAs rule expects the input value to be different
   * from the other field's value
   *
   * By default, the comparions of day, month and years are performed
   */

  notSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(notSameAsRule({ otherField, ...options }))
  }

  /**
   * The afterField rule expects the input value to be after
   * the other field's value.
   *
   * By default, the comparions of day, month and years are performed
   */
  afterField(otherField: string, options?: DateEqualsOptions): this {
    return this.use(afterFieldRule({ otherField, ...options }))
  }

  /**
   * The afterOrSameAs rule expects the input value to be after
   * or equal to the other field's value.
   *
   * By default, the comparions of day, month and years are performed
   */
  afterOrSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(afterOrSameAsRule({ otherField, ...options }))
  }

  /**
   * The beforeField rule expects the input value to be before
   * the other field's value.
   *
   * By default, the comparions of day, month and years are performed
   */
  beforeField(otherField: string, options?: DateEqualsOptions): this {
    return this.use(beforeFieldRule({ otherField, ...options }))
  }

  /**
   * The beforeOrSameAs rule expects the input value to be before
   * or same as the other field's value.
   *
   * By default, the comparions of day, month and years are performed
   */
  beforeOrSameAs(otherField: string, options?: DateEqualsOptions): this {
    return this.use(beforeOrSameAsRule({ otherField, ...options }))
  }

  /**
   * Clones the VineDate schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineDate(this.cloneOptions(), this.cloneValidations()) as this
  }
}
