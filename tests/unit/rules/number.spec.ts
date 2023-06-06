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
} from '../../../src/schema/number/rules.js'

test.group('Number | number', () => {
  test('report when value is not a number', () => {
    const number = numberRule()
    const validated = validator.execute(number, 'foo')

    validated.assertError('The value must be a number')
  })

  test('pass validation when value is a number', () => {
    const number = numberRule()
    const validated = validator.execute(number, 22)

    validated.assertDoesNotHaveErrors()
    validated.assertOutput(22)
  })

  test('pass validation when value is a string representation of a number', () => {
    const number = numberRule()
    const validated = validator.execute(number, '22')

    validated.assertDoesNotHaveErrors()
    validated.assertOutput(22)
  })
})

test.group('Number | min', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule()
    const min = minRule({ min: 18 })
    const validated = validator.execute([number, min], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The value must be a number')
  })

  test('report error when value is less than the minimum value', () => {
    const number = numberRule()
    const min = minRule({ min: 18 })
    const validated = validator.execute([number, min], 12)

    validated.assertErrorsCount(1)
    validated.assertError('The value of field must be at least 18')
  })

  test('pass validation when value is same or greater than the minimum value', () => {
    const number = numberRule()
    const min = minRule({ min: 18 })

    validator.execute([number, min], 18).assertErrorsCount(0)
    validator.execute([number, min], 20).assertErrorsCount(0)
  })
})

test.group('Number | max', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule()
    const max = maxRule({ max: 60 })
    const validated = validator.execute([number, max], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The value must be a number')
  })

  test('report error when value is greater than the maximum value', () => {
    const number = numberRule()
    const max = maxRule({ max: 60 })
    const validated = validator.execute([number, max], 72)

    validated.assertErrorsCount(1)
    validated.assertError('The value of field must not be greater than 60')
  })

  test('pass validation when value is same or less than the minimum value', () => {
    const number = numberRule()
    const max = maxRule({ max: 60 })

    validator.execute([number, max], 60).assertErrorsCount(0)
    validator.execute([number, max], 32).assertErrorsCount(0)
  })
})

test.group('Number | range', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule()
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The value must be a number')
  })

  test('report error when value is greater than the maximum value', () => {
    const number = numberRule()
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 72)

    validated.assertErrorsCount(1)
    validated.assertError('The value of field must be between 18 and 60')
  })

  test('report error when value is less than the minimum value', () => {
    const number = numberRule()
    const range = rangeRule({ min: 18, max: 60 })
    const validated = validator.execute([number, range], 12)

    validated.assertErrorsCount(1)
    validated.assertError('The value of field must be between 18 and 60')
  })

  test('pass validation when value is under the range', () => {
    const number = numberRule()
    const range = rangeRule({ min: 18, max: 60 })

    validator.execute([number, range], 18).assertErrorsCount(0)
    validator.execute([number, range], 60).assertErrorsCount(0)
    validator.execute([number, range], 22).assertErrorsCount(0)
  })
})

test.group('Number | positive', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule()
    const positive = positiveRule()
    const validated = validator.execute([number, positive], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The value must be a number')
  })

  test('report error when value is negative', () => {
    const number = numberRule()
    const positive = positiveRule()

    const validated = validator.execute([number, positive], -10)
    validated.assertErrorsCount(1)
    validated.assertError('The value of field must be a positive number')

    const validated1 = validator.execute([number, positive], '-10')
    validated1.assertErrorsCount(1)
    validated1.assertError('The value of field must be a positive number')
  })

  test('pass validation when value is positive', () => {
    const number = numberRule()
    const positive = positiveRule()

    validator.execute([number, positive], 10).assertErrorsCount(0)
    validator.execute([number, positive], '0').assertErrorsCount(0)
  })
})

test.group('Number | negative', () => {
  test('skip validation when value is not a number', () => {
    const number = numberRule()
    const negative = negativeRule()
    const validated = validator.execute([number, negative], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The value must be a number')
  })

  test('report error when value is positive', () => {
    const number = numberRule()
    const negative = negativeRule()

    const validated = validator.execute([number, negative], 0)
    validated.assertErrorsCount(1)
    validated.assertError('The value of field must be a negative number')

    const validated1 = validator.execute([number, negative], '10')
    validated1.assertErrorsCount(1)
    validated1.assertError('The value of field must be a negative number')
  })

  test('pass validation when value is negative', () => {
    const number = numberRule()
    const negative = negativeRule()

    validator.execute([number, negative], '-10').assertErrorsCount(0)
    validator.execute([number, negative], -1).assertErrorsCount(0)
  })
})
