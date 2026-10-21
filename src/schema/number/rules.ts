/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { messages } from '../../defaults.js'
import { helpers } from '../../vine/helpers.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Enforces the value to be a number or a string representation of a number.
 * Converts string numbers to actual numbers and validates against NaN and Infinity.
 *
 * @example
 * vine.number()
 * vine.number({ strict: true })
 */
export const numberRule = createRule<{ strict?: boolean }>(
  function number(value, options, field) {
    if (!field.isDefined) {
      return false
    }

    const valueAsNumber = options.strict ? value : helpers.asNumber(value)

    if (
      typeof valueAsNumber !== 'number' ||
      Number.isNaN(valueAsNumber) ||
      valueAsNumber === Number.POSITIVE_INFINITY ||
      valueAsNumber === Number.NEGATIVE_INFINITY
    ) {
      field.report(messages.number, 'number', field)
      return false
    }

    field.mutate(valueAsNumber, field)
    return true
  },
  {
    toJSONSchema: (schema) => {
      schema.type = 'number'
    },
  }
)

/**
 * Enforces a minimum value on a number field.
 * The number must be greater than or equal to the specified minimum.
 *
 * @example
 * vine.number().min(0)
 * vine.number().min(18)
 */
export const minRule = createRule<{ min: number }>(
  function min(value, options, field) {
    if ((value as number) < options.min) {
      field.report(messages.min, 'min', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minimum = options.min
    },
  }
)

/**
 * Enforces a maximum value on a number field.
 * The number must be less than or equal to the specified maximum.
 *
 * @example
 * vine.number().max(100)
 * vine.number().max(65)
 */
export const maxRule = createRule<{ max: number }>(
  function max(value, options, field) {
    if ((value as number) > options.max) {
      field.report(messages.max, 'max', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.maximum = options.max
    },
  }
)

/**
 * Enforces the value to be within a range of minimum and maximum values.
 * The number must be between min and max (inclusive).
 *
 * @example
 * vine.number().range([1, 100])
 * vine.number().range([18, 65])
 */
export const rangeRule = createRule<{ min: number; max: number }>(
  function range(value, options, field) {
    if ((value as number) < options.min || (value as number) > options.max) {
      field.report(messages.range, 'range', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.minimum = options.min
      schema.maximum = options.max
    },
  }
)

/**
 * Enforces the value to be a positive number (greater than 0).
 * Zero is considered neutral and will fail this validation.
 *
 * @example
 * vine.number().positive()
 */
export const positiveRule = createRule(
  function positive(value, _, field) {
    if ((value as number) > 0) {
      return
    }
    field.report(messages.positive, 'positive', field)
  },
  {
    toJSONSchema: (schema) => {
      schema.exclusiveMinimum = 0
    },
  }
)

/**
 * Enforces the value to be a negative number (less than 0).
 * Zero is considered neutral and will fail this validation.
 *
 * @example
 * vine.number().negative()
 */
export const negativeRule = createRule<undefined>(
  function negative(value, _, field) {
    if ((value as number) < 0) {
      return
    }
    field.report(messages.negative, 'negative', field)
  },
  {
    toJSONSchema: (schema) => {
      schema.exclusiveMaximum = 0
    },
  }
)

/**
 * Enforces the value to be a non-negative number (greater than or equal to 0).
 * Accepts zero and all positive numbers.
 *
 * @example
 * vine.number().nonNegative()
 */
export const nonNegativeRule = createRule<undefined>(function nonNegative(value, _, field) {
  if ((value as number) >= 0) {
    return
  }
  field.report(messages.nonNegative, 'nonNegative', field)
})

/**
 * Enforces the value to be a non-positive number (less than or equal to 0).
 * Accepts zero and all negative numbers.
 *
 * @example
 * vine.number().nonPositive()
 */
export const nonPositiveRule = createRule(function nonPositive(value, _, field) {
  if ((value as number) <= 0) {
    return
  }
  field.report(messages.nonPositive, 'nonPositive', field)
})

/**
 * Enforces the value to have a fixed number or range of decimal places.
 * Validates the precision of the decimal number.
 *
 * @example
 * vine.number().decimal(2)
 * vine.number().decimal([0, 2])
 */
export const decimalRule = createRule<{ range: [number, number?] }>(
  function decimal(value, options, field) {
    if (
      !helpers.isDecimal(String(value), {
        force_decimal: options.range[0] !== 0,
        decimal_digits: options.range.join(','),
      })
    ) {
      field.report(messages.decimal, 'decimal', field, { digits: options.range.join('-') })
    }
  }
)

/**
 * Enforces the value to be an integer without decimal places.
 * The number must be a whole number.
 *
 * @example
 * vine.number().withoutDecimals()
 */
export const withoutDecimalsRule = createRule(
  function withoutDecimals(value, _, field) {
    if (!Number.isInteger(value)) {
      field.report(messages.withoutDecimals, 'withoutDecimals', field)
    }
  },
  {
    toJSONSchema: (schema) => {
      schema.type = 'integer'
    },
  }
)

/**
 * Enforces the value to be one of the specified allowed values.
 * The number must match one of the values in the provided list.
 *
 * @example
 * vine.number().in([1, 2, 3, 5, 8, 13])
 * vine.number().in([10, 20, 30])
 */
export const inRule = createRule<{ values: number[] }>(
  function inValues(value, options, field) {
    if (!options.values.includes(value as number)) {
      field.report(messages['number.in'], 'in', field, options)
    }
  },
  {
    toJSONSchema: (schema, options) => {
      schema.enum = options.values
    },
  }
)
