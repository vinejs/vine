/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { helpers } from '../../vine/helpers.js'
import { createRule } from '../../vine/create_rule.js'
import { messages } from '../../defaults.js'

/**
 * Enforce the value to be a number or a string representation
 * of a number
 */
export const numberRule = createRule<{ strict?: boolean }>(
  (value, options, field) => {
    const valueAsNumber = options.strict ? value : helpers.asNumber(value)

    if (
      typeof valueAsNumber !== 'number' ||
      Number.isNaN(valueAsNumber) ||
      valueAsNumber === Number.POSITIVE_INFINITY ||
      valueAsNumber === Number.NEGATIVE_INFINITY
    ) {
      field.report(messages.number, 'number', field)
      return
    }

    field.mutate(valueAsNumber, field)
  },
  {
    json: (schema) => {
      schema.type = 'number'
    },
  }
)

/**
 * Enforce a minimum value on a number field
 */
export const minRule = createRule<{ min: number }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if ((value as number) < options.min) {
      field.report(messages.min, 'min', field, options)
    }
  },
  {
    json: (schema, options) => {
      schema.minimum = options.min
    },
  }
)

/**
 * Enforce a maximum value on a number field
 */
export const maxRule = createRule<{ max: number }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if ((value as number) > options.max) {
      field.report(messages.max, 'max', field, options)
    }
  },
  {
    json: (schema, options) => {
      schema.maximum = options.max
    },
  }
)

/**
 * Enforce a range of values on a number field.
 */
export const rangeRule = createRule<{ min: number; max: number }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if ((value as number) < options.min || (value as number) > options.max) {
      field.report(messages.range, 'range', field, options)
    }
  },
  {
    json: (schema, options) => {
      schema.minimum = options.min
      schema.maximum = options.max
    },
  }
)

/**
 * Enforce the value is a positive number
 */
export const positiveRule = createRule(
  (value, _, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if ((value as number) < 0) {
      field.report(messages.positive, 'positive', field)
    }
  },
  {
    json: (schema) => {
      schema.minimum = 0
    },
  }
)

/**
 * Enforce the value is a negative number
 */
export const negativeRule = createRule<undefined>(
  (value, _, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if ((value as number) >= 0) {
      field.report(messages.negative, 'negative', field)
    }
  },
  {
    json: (schema) => {
      schema.exclusiveMaximum = 0
    },
  }
)

/**
 * Enforce the value to have a fixed or range of decimals
 */

// TODO: Handle json-schema. Range can be handled with anyOf but we have floating point precision issues
export const decimalRule = createRule<{ range: [number, number?] }>((value, options, field) => {
  /**
   * Skip if the field is not valid.
   */
  if (!field.isValid) {
    return
  }

  if (
    !helpers.isDecimal(String(value), {
      force_decimal: options.range[0] !== 0,
      decimal_digits: options.range.join(','),
    })
  ) {
    field.report(messages.decimal, 'decimal', field, { digits: options.range.join('-') })
  }
})

/**
 * Enforce the value to not have decimal places
 */
export const withoutDecimalsRule = createRule(
  (value, _, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if (!Number.isInteger(value)) {
      field.report(messages.withoutDecimals, 'withoutDecimals', field)
    }
  },
  {
    json: (schema) => {
      schema.type = 'integer'
    },
  }
)

/**
 * Enforce the value to be in a list of allowed values
 */
export const inRule = createRule<{ values: number[] }>(
  (value, options, field) => {
    /**
     * Skip if the field is not valid.
     */
    if (!field.isValid) {
      return
    }

    if (!options.values.includes(value as number)) {
      field.report(messages['number.in'], 'in', field, options)
    }
  },
  {
    json: (schema, options) => {
      schema.enum = options.values
    },
  }
)
