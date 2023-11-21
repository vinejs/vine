/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dayjs, { type Dayjs } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'
import type { DateEqualsOptions, DateFieldOptions, FieldContext } from '../../types.js'
import { helpers } from '../../vine/helpers.js'

export const DEFAULT_DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']

/**
 * Registering plugins
 */
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

/**
 * Validates the value to be a string or number formatted
 * as per the expected date-time format.
 */
export const dateRule = createRule<Partial<DateFieldOptions>>((value, options, field) => {
  if (typeof value !== 'string') {
    field.report(messages.date, 'date', field)
    return
  }

  const formats = options.formats || DEFAULT_DATE_FORMATS
  const dateTime = dayjs(value, formats, true)

  /**
   * Ensure post parsing the datetime instance is valid
   */
  if (!dateTime.isValid()) {
    field.report(messages.date, 'date', field)
    return
  }

  field.meta.$value = dateTime
  field.meta.$formats = formats
  field.mutate(dateTime.toDate(), field)
})

/**
 * The equals rule compares the input value to be same
 * as the expected value.
 *
 * By default, the comparions of day, month and years are performed
 */
export const equalsRule = createRule<
  {
    expectedValue: string | ((field: FieldContext) => string)
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const format = options.format || DEFAULT_DATE_FORMATS
  const dateTime = field.meta.$value as Dayjs
  const expectedValue =
    typeof options.expectedValue === 'function'
      ? options.expectedValue(field)
      : options.expectedValue

  const expectedDateTime = dayjs(expectedValue, format, true)
  if (!expectedDateTime.isValid()) {
    throw new Error(`Invalid datetime value "${expectedValue}" value provided to the equals rule`)
  }

  /**
   * Ensure both the dates are the same
   */
  if (!dateTime.isSame(expectedDateTime, compare)) {
    field.report(messages['date.equals'], 'date.equals', field, {
      expectedValue,
      compare,
    })
  }
})

/**
 * The after rule compares the input value to be after
 * the expected value.
 *
 * By default, the comparions of day, month and years are performed.
 */
export const afterRule = createRule<
  {
    expectedValue:
      | 'today'
      | 'tomorrow'
      | (string & { _?: never })
      | ((field: FieldContext) => string)
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const format = options.format || DEFAULT_DATE_FORMATS
  const dateTime = field.meta.$value as Dayjs

  const expectedValue =
    typeof options.expectedValue === 'function'
      ? options.expectedValue(field)
      : options.expectedValue

  const expectedDateTime =
    expectedValue === 'today'
      ? dayjs()
      : expectedValue === 'tomorrow'
        ? dayjs().add(1, 'day')
        : dayjs(expectedValue, format, true)

  if (!expectedDateTime.isValid()) {
    throw new Error(`Invalid datetime value "${expectedValue}" value provided to the after rule`)
  }

  /**
   * Ensure the input is after the expected value
   */
  if (!dateTime.isAfter(expectedDateTime, compare)) {
    field.report(messages['date.after'], 'date.after', field, {
      expectedValue,
      compare,
    })
  }
})

/**
 * The after or equal rule compares the input value to be
 * after or equal to the expected value.
 *
 * By default, the comparions of day, month and years are performed.
 */
export const afterOrEqualRule = createRule<
  {
    expectedValue:
      | 'today'
      | 'tomorrow'
      | (string & { _?: never })
      | ((field: FieldContext) => string)
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const format = options.format || DEFAULT_DATE_FORMATS
  const dateTime = field.meta.$value as Dayjs

  const expectedValue =
    typeof options.expectedValue === 'function'
      ? options.expectedValue(field)
      : options.expectedValue

  const expectedDateTime =
    expectedValue === 'today'
      ? dayjs()
      : expectedValue === 'tomorrow'
        ? dayjs().add(1, 'day')
        : dayjs(expectedValue, format, true)

  if (!expectedDateTime.isValid()) {
    throw new Error(
      `Invalid datetime value "${expectedValue}" value provided to the afterOrEqual rule`
    )
  }

  /**
   * Ensure both the dates are the same or the input
   * is after than the expected value.
   */
  if (!dateTime.isSameOrAfter(expectedDateTime, compare)) {
    field.report(messages['date.afterOrEqual'], 'date.afterOrEqual', field, {
      expectedValue,
      compare,
    })
  }
})

/**
 * The before rule compares the input value to be before
 * the expected value.
 *
 * By default, the comparions of day, month and years are performed.
 */
export const beforeRule = createRule<
  {
    expectedValue:
      | 'today'
      | 'yesterday'
      | (string & { _?: never })
      | ((field: FieldContext) => string)
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const format = options.format || DEFAULT_DATE_FORMATS
  const dateTime = field.meta.$value as Dayjs

  const expectedValue =
    typeof options.expectedValue === 'function'
      ? options.expectedValue(field)
      : options.expectedValue

  const expectedDateTime =
    expectedValue === 'today'
      ? dayjs()
      : expectedValue === 'yesterday'
        ? dayjs().subtract(1, 'day')
        : dayjs(expectedValue, format, true)

  if (!expectedDateTime.isValid()) {
    throw new Error(`Invalid datetime value "${expectedValue}" value provided to the before rule`)
  }

  /**
   * Ensure the input is before the expected value
   */
  if (!dateTime.isBefore(expectedDateTime, compare)) {
    field.report(messages['date.before'], 'date.before', field, {
      expectedValue,
      compare,
    })
  }
})

/**
 * The before or equal rule compares the input value to be
 * before or equal to the expected value.
 *
 * By default, the comparions of day, month and years are performed.
 */
export const beforeOrEqualRule = createRule<
  {
    expectedValue:
      | 'today'
      | 'yesterday'
      | (string & { _?: never })
      | ((field: FieldContext) => string)
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const format = options.format || DEFAULT_DATE_FORMATS
  const dateTime = field.meta.$value as Dayjs

  const expectedValue =
    typeof options.expectedValue === 'function'
      ? options.expectedValue(field)
      : options.expectedValue

  const expectedDateTime =
    expectedValue === 'today'
      ? dayjs()
      : expectedValue === 'yesterday'
        ? dayjs().subtract(1, 'day')
        : dayjs(expectedValue, format, true)

  if (!expectedDateTime.isValid()) {
    throw new Error(
      `Invalid datetime value "${expectedValue}" value provided to the beforeOrEqual rule`
    )
  }

  /**
   * Ensure the input is same or before the expected value
   */
  if (!dateTime.isSameOrBefore(expectedDateTime, compare)) {
    field.report(messages['date.beforeOrEqual'], 'date.beforeOrEqual', field, {
      expectedValue,
      compare,
    })
  }
})

/**
 * The sameAs rule expects the input value to be same
 * as the value of the other field.
 *
 * By default, the comparions of day, month and years are performed
 */
export const sameAsRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure both the dates are the same
   */
  if (!dateTime.isSame(expectedDateTime, compare)) {
    field.report(messages['date.sameAs'], 'date.sameAs', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The notSameAs rule expects the input value to be different
 * from the other field's value
 *
 * By default, the comparions of day, month and years are performed
 */
export const notSameAsRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure both the dates are different
   */
  if (dateTime.isSame(expectedDateTime, compare)) {
    field.report(messages['date.notSameAs'], 'date.notSameAs', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The afterField rule expects the input value to be after
 * the other field's value.
 *
 * By default, the comparions of day, month and years are performed
 */
export const afterFieldRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure the input date is after the other field's value
   */
  if (!dateTime.isAfter(expectedDateTime, compare)) {
    field.report(messages['date.afterField'], 'date.afterField', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The afterOrSameAs rule expects the input value to be after
 * or same as the other field's value.
 *
 * By default, the comparions of day, month and years are performed
 */
export const afterOrSameAsRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure the input date is same as or after the other field's value
   */
  if (!dateTime.isSameOrAfter(expectedDateTime, compare)) {
    field.report(messages['date.afterOrSameAs'], 'date.afterOrSameAs', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The beforeField rule expects the input value to be before
 * the other field's value.
 *
 * By default, the comparions of day, month and years are performed
 */
export const beforeFieldRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure the input date is before the other field's value
   */
  if (!dateTime.isBefore(expectedDateTime, compare)) {
    field.report(messages['date.beforeField'], 'date.beforeField', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The beforeOrSameAs rule expects the input value to be before
 * or same as the other field's value.
 *
 * By default, the comparions of day, month and years are performed
 */
export const beforeOrSameAsRule = createRule<
  {
    otherField: string
  } & DateEqualsOptions
>((_, options, field) => {
  if (!field.meta.$value) {
    return
  }

  const compare = options.compare || 'day'
  const dateTime = field.meta.$value as Dayjs
  const format = options.format || field.meta.$formats
  const expectedValue = helpers.getNestedValue(options.otherField, field)
  const expectedDateTime = dayjs(expectedValue, format, true)

  /**
   * Skip validation when the other field is not a valid
   * datetime. We will let the `date` rule on that
   * other field to handle the invalid date.
   */
  if (!expectedDateTime.isValid()) {
    return
  }

  /**
   * Ensure the input date is before or same as the other field's value
   */
  if (!dateTime.isSameOrBefore(expectedDateTime, compare)) {
    field.report(messages['date.beforeOrSameAs'], 'date.beforeOrSameAs', field, {
      otherField: options.otherField,
      expectedValue,
      compare,
    })
  }
})

/**
 * The weekend rule ensures the date falls on a weekend
 */
export const weekendRule = createRule((_, __, field) => {
  if (!field.meta.$value) {
    return
  }

  const dateTime = field.meta.$value as Dayjs
  const day = dateTime.day()

  if (day !== 0 && day !== 6) {
    field.report(messages['date.weekend'], 'date.weekend', field)
  }
})

/**
 * The weekday rule ensures the date falls on a weekday
 */
export const weekdayRule = createRule((_, __, field) => {
  if (!field.meta.$value) {
    return
  }

  const dateTime = field.meta.$value as Dayjs
  const day = dateTime.day()

  if (day === 0 || day === 6) {
    field.report(messages['date.weekday'], 'date.weekday', field)
  }
})
