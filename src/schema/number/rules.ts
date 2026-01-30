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
 * Enforce the value to be a number or a string representation
 * of a number
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
 * Enforce a minimum value on a number field
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
 * Enforce a maximum value on a number field
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
 * Enforce a range of values on a number field.
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
 * Enforce the value is a positive number. Zero is considered a neutral
 * number and will fail the positive validation.
 *
 * A number greater than (0). For example, (1,2,3,0.5).
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
      schema.minimum = 0
    },
  }
)

/**
 * Enforce the value is a negative number. Zero is considered a neutral
 * number and will fail the negative validation.
 *
 * A number less than (0). For example, (-1,-2,-3,-0.5)
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
 * A number that is either positive or zero (greater than or equal to (0)).
 * For example, (0,1,2,0.5).
 */
export const nonNegativeRule = createRule<undefined>(function nonNegative(value, _, field) {
  if ((value as number) >= 0) {
    return
  }
  field.report(messages.nonNegative, 'nonNegative', field)
})

/**
 * A number that is either negative or zero (less than or equal to (0)).
 * For example, (0,-1,-2,-0.5)
 */
export const nonPositiveRule = createRule(function nonPositive(value, _, field) {
  if ((value as number) <= 0) {
    return
  }
  field.report(messages.nonPositive, 'nonPositive', field)
})

/**
 * Enforce the value to have a fixed or range of decimals
 */
// TODO: Handle json-schema. Range can be handled with anyOf but we have floating point precision issues
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
 * Enforce the value to not have decimal places
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
 * Enforce the value to be in a list of allowed values
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
