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
import { requiredWhen } from '../../../src/schema/base/rules.js'

test.group('Required when', () => {
  test('report error when field is missing but required', () => {
    const boolean = requiredWhen(() => {
      return true
    })
    const validated = validator.execute(boolean, undefined)

    validated.assertError('The dummy field must be defined')
  })

  test('report error when field is null but required', () => {
    const boolean = requiredWhen(() => {
      return true
    })
    const validated = validator.execute(boolean, null)

    validated.assertError('The dummy field must be defined')
  })

  test('do not report error when field is missing but not required', () => {
    const boolean = requiredWhen(() => {
      return false
    })
    const validated = validator.execute(boolean, undefined)
    validated.assertSucceeded()
  })

  test('do not report error when field is null but not required', () => {
    const boolean = requiredWhen(() => {
      return false
    })
    const validated = validator.execute(boolean, null)
    validated.assertSucceeded()
  })
})
