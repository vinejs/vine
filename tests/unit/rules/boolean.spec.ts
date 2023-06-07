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
import { booleanRule } from '../../../src/schema/boolean/rules.js'

test.group('Boolean | boolean', () => {
  test('report when value is not a boolean', () => {
    const boolean = booleanRule({})
    const validated = validator.execute(boolean, 'foo')

    validated.assertError('The value must be a boolean')
  })

  test('pass validation when value is a boolean', () => {
    const boolean = booleanRule({})

    const withTrue = validator.execute(boolean, true)
    withTrue.assertSucceeded()
    withTrue.assertOutput(true)

    const withFalse = validator.execute(boolean, false)
    withFalse.assertSucceeded()
    withFalse.assertOutput(false)

    const withZero = validator.execute(boolean, 0)
    withZero.assertSucceeded()
    withZero.assertOutput(false)

    const withOne = validator.execute(boolean, 1)
    withOne.assertSucceeded()
    withOne.assertOutput(true)
  })

  test('pass validation when value is a string representation of boolean', () => {
    const boolean = booleanRule({})

    const withTrue = validator.execute(boolean, 'true')
    withTrue.assertSucceeded()
    withTrue.assertOutput(true)

    const withFalse = validator.execute(boolean, 'false')
    withFalse.assertSucceeded()
    withFalse.assertOutput(false)

    const withZero = validator.execute(boolean, '0')
    withZero.assertSucceeded()
    withZero.assertOutput(false)

    const withOne = validator.execute(boolean, '1')
    withOne.assertSucceeded()
    withOne.assertOutput(true)
  })

  test('disallow string representation in strict mode', () => {
    const boolean = booleanRule({ strict: true })

    const withTrue = validator.execute(boolean, 'true')
    withTrue.assertError('The value must be a boolean')

    const withFalse = validator.execute(boolean, 'false')
    withFalse.assertError('The value must be a boolean')

    const withZero = validator.execute(boolean, '0')
    withZero.assertError('The value must be a boolean')

    const withOne = validator.execute(boolean, '1')
    withOne.assertError('The value must be a boolean')
  })

  test('report when value is a number other than 0 or 1', () => {
    const boolean = booleanRule({})
    const validated = validator.execute(boolean, 2)

    validated.assertError('The value must be a boolean')
  })
})
