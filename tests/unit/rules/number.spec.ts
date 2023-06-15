/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { validator } from '../../../factories/main.js'
import {
  minRule,
  maxRule,
  rangeRule,
  numberRule,
  positiveRule,
  negativeRule,
  decimalRule,
  withoutDecimalsRule,
} from '../../../src/schema/number/rules.js'

test.group('Number | number', () => {
  test('report when value is not a number', () => {
    const number = numberRule({})
    const validated = validator.execute(number, 'foo')

    validated.assertError('The dummy field must be a number')
  })

  test('pass validation when value is a number', () => {
    const number = numberRule({})
    const validated = validator.execute(number, 22)

    validated.assertSucceeded()
    validated.assertOutput(22)
  })

  test('pass validation when value is a string representation of a number', () => {
    const number = numberRule({})
    const validated = validator.execute(number, '22')

    validated.assertSucceeded()
    validated.assertOutput(22)
  })

  test('disallow string representation in strict mode', () => {
    const number = numberRule({ strict: true })

    const validated = validator.execute(number, '22')
    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')

    const withNaN = validator.execute(number, Number.NaN)
    withNaN.assertErrorsCount(1)
    withNaN.assertError('The dummy field must be a number')
  })

  test('report when value is an infinite number', () => {
    const number = numberRule({})
    const validated = validator.execute(
      number,
      '3177777777777777777777777777777777777777777777777777777777777777777777777770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    )

    validated.assertError('The dummy field must be a number')
  })

  test('report when value is a negative infinite number', () => {
    const number = numberRule({})
    const validated = validator.execute(
      number,
      '-3177777777777777777777777777777777777777777777777777777777777777777777777770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    )

    validated.assertError('The dummy field must be a number')
  })
})

test.group('Number | min', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const min = minRule({ min: 18 })
    const validated = validator.execute([number, min], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const min = minRule({ min: 18 })
    const validated = validator.bail(false).execute([number, min], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value is less than the minimum value', () => {
    const number = numberRule({})
    const min = minRule({ min: 18 })
    const validated = validator.execute([number, min], 12)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be at least 18')
  })

  test('pass validation when value is same or greater than the minimum value', () => {
    const number = numberRule({})
    const min = minRule({ min: 18 })

    validator.execute([number, min], 18).assertErrorsCount(0)
    validator.execute([number, min], 20).assertErrorsCount(0)
  })
})

test.group('Number | max', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const max = maxRule({ max: 60 })
    const validated = validator.execute([number, max], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const max = maxRule({ max: 60 })
    const validated = validator.bail(false).execute([number, max], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value is greater than the maximum value', () => {
    const number = numberRule({})
    const max = maxRule({ max: 60 })
    const validated = validator.execute([number, max], 72)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must not be greater than 60')
  })

  test('pass validation when value is same or less than the minimum value', () => {
    const number = numberRule({})
    const max = maxRule({ max: 60 })

    validator.execute([number, max], 60).assertErrorsCount(0)
    validator.execute([number, max], 32).assertErrorsCount(0)
  })
})

test.group('Number | range', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.bail(false).execute([number, range], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value is greater than the maximum value', () => {
    const number = numberRule({})
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 72)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be between 18 and 60')
  })

  test('report error when value is less than the minimum value', () => {
    const number = numberRule({})
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 12)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be between 18 and 60')
  })

  test('pass validation when value is under the range', () => {
    const number = numberRule({})
    const range = rangeRule({ min: 18, max: 60 })

    validator.execute([number, range], 18).assertErrorsCount(0)
    validator.execute([number, range], 60).assertErrorsCount(0)
    validator.execute([number, range], 22).assertErrorsCount(0)
  })
})

test.group('Number | positive', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const positive = positiveRule()
    const validated = validator.execute([number, positive], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const positive = positiveRule()
    const validated = validator.bail(false).execute([number, positive], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value is negative', () => {
    const number = numberRule({})
    const positive = positiveRule()

    const validated = validator.execute([number, positive], -10)
    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be positive')

    const validated1 = validator.execute([number, positive], '-10')
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be positive')
  })

  test('pass validation when value is positive', () => {
    const number = numberRule({})
    const positive = positiveRule()

    validator.execute([number, positive], 10).assertErrorsCount(0)
    validator.execute([number, positive], '0').assertErrorsCount(0)
  })
})

test.group('Number | negative', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const negative = negativeRule()
    const validated = validator.execute([number, negative], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const negative = negativeRule()
    const validated = validator.bail(false).execute([number, negative], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value is positive', () => {
    const number = numberRule({})
    const negative = negativeRule()

    const validated = validator.execute([number, negative], 0)
    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be negative')

    const validated1 = validator.execute([number, negative], '10')
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be negative')
  })

  test('pass validation when value is negative', () => {
    const number = numberRule({})
    const negative = negativeRule()

    validator.execute([number, negative], '-10').assertErrorsCount(0)
    validator.execute([number, negative], -1).assertErrorsCount(0)
  })
})

test.group('Number | decimals', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [0, 2] })
    const validated = validator.execute([number, decimal], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [0, 2] })
    const validated = validator.bail(false).execute([number, decimal], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value has less than fixed decimal places', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [2] })
    const validated = validator.execute([number, decimal], '9')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must have 2 decimal places')
  })

  test('report error when value has more than fixed decimal places', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [2] })
    const validated = validator.execute([number, decimal], '9.9899')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must have 2 decimal places')
  })

  test('work fine when value has exact decimal places', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [2] })
    const validated = validator.execute([number, decimal], '9.99')

    validated.assertSucceeded()
    validated.assertOutput(9.99)
  })

  test('report error when value has less than the range of decimal places', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [2, 4] })
    const validated = validator.execute([number, decimal], '9')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must have 2-4 decimal places')
  })

  test('report error when value has more than the range of decimal places', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [2, 4] })
    const validated = validator.execute([number, decimal], '9.90009')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must have 2-4 decimal places')
  })

  test('work fine when value decimal places are in range', () => {
    const number = numberRule({})
    const decimal = decimalRule({ range: [0, 2] })

    const validated = validator.execute([number, decimal], '9.99')
    validated.assertSucceeded()
    validated.assertOutput(9.99)

    const validated1 = validator.execute([number, decimal], '9')
    validated1.assertSucceeded()
    validated1.assertOutput(9)
  })
})

test.group('Number | withoutDecimals', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule({})
    const withoutDecimals = withoutDecimalsRule()
    const validated = validator.execute([number, withoutDecimals], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('skip validation when value is not a number with bail mode disabled', () => {
    const number = numberRule({})
    const withoutDecimals = withoutDecimalsRule()
    const validated = validator.bail(false).execute([number, withoutDecimals], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a number')
  })

  test('report error when value has decimal places', () => {
    const number = numberRule({})
    const withoutDecimals = withoutDecimalsRule()
    const validated = validator.execute([number, withoutDecimals], '18.11')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be an integer')
  })

  test('work fine when value is an integer', () => {
    const number = numberRule({})
    const withoutDecimals = withoutDecimalsRule()
    const validated = validator.execute([number, withoutDecimals], '18.00')

    validated.assertSucceeded()
    validated.assertOutput(18)
  })
})
