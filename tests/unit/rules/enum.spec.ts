/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { enumRule } from '../../../src/schema/enum/rules.js'
import { ValidatorFactory } from '../../../factories/validator.js'

test.group('Rules | enum', () => {
  test('report error when field value is not a subset of pre-defined choices', () => {
    const validation = enumRule({ choices: ['admin', 'moderator', 'guest'] })
    const value = 'foo'

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertError('The selected dummy is invalid')
  })

  test('do not validate when value is undefined', () => {
    const validation = enumRule({ choices: ['admin', 'moderator', 'guest'] })
    const value = undefined

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertErrorsCount(0)
  })

  test('do not validate when value is null', () => {
    const validation = enumRule({ choices: ['admin', 'moderator', 'guest'] })
    const value = null

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertErrorsCount(0)
  })

  test('report error when value is empty string', () => {
    const validation = enumRule({ choices: ['admin', 'moderator', 'guest'] })
    const value = ''

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertError('The selected dummy is invalid')
  })

  test('pass validation when value is a subset of choices', () => {
    const validation = enumRule({ choices: ['admin', 'moderator', 'guest'] })
    const value = 'admin'

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertErrorsCount(0)
  })

  test('compute choices from a callback', () => {
    const validation = enumRule({ choices: () => ['admin', 'moderator', 'guest'] })
    const value = 'admin'

    const validated = new ValidatorFactory().execute(validation, value)
    validated.assertErrorsCount(0)
  })
})
