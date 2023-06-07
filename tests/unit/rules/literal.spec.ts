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
import { equalsRule } from '../../../src/schema/literal/rules.js'

test.group('Literal | equals', () => {
  test('report when input value is not same as expected value', () => {
    const equals = equalsRule({ expectedValue: 1 })
    const validated = validator.execute(equals, 'foo')

    validated.assertError('The dummy field must be 1')
  })

  test('pass when input value is same as expected value', () => {
    const equals = equalsRule({ expectedValue: 1 })
    const validated = validator.execute(equals, 1)

    validated.assertSucceeded()
    validated.assertOutput(1)
  })

  test('normalize input value when expected value is a number', () => {
    const equals = equalsRule({ expectedValue: 1 })
    const validated = validator.execute(equals, '1')

    validated.assertSucceeded()
    validated.assertOutput(1)
  })

  test('normalize input value when expected value is a boolean', () => {
    const equals = equalsRule({ expectedValue: false })
    const validated = validator.execute(equals, 'false')
    validated.assertSucceeded()
    validated.assertOutput(false)

    const equals1 = equalsRule({ expectedValue: true })
    const validated1 = validator.execute(equals1, 'true')
    validated1.assertSucceeded()
    validated1.assertOutput(true)
  })
})
