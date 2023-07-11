/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { fileURLToPath } from 'node:url'
import { ValidationError } from '../../src/errors/validation_error.js'

test.group('Exception', () => {
  test('create exception with error messages', ({ assert }) => {
    const error = new ValidationError([{ message: 'Field is required' }])

    assert.equal(error.message, 'Validation failure')
    assert.equal(error.status, 422)
    assert.equal(error.code, 'E_VALIDATION_ERROR')
    assert.deepEqual(error.messages, [{ message: 'Field is required' }])
  })

  test('point stack trace to correct file', ({ assert }) => {
    assert.plan(1)

    try {
      throw new ValidationError([{ message: 'Field is required' }])
    } catch (error) {
      assert.match(error.stack.split('\n')[1], new RegExp(fileURLToPath(import.meta.url)))
    }
  })

  test('convert error to string', ({ assert }) => {
    const error = new ValidationError([{ message: 'Field is required' }])
    assert.equal(error.toString(), 'Error [E_VALIDATION_ERROR]: Validation failure')
  })

  test('get class string name', ({ assert }) => {
    const error = new ValidationError([{ message: 'Field is required' }])
    assert.equal(Object.prototype.toString.call(error), '[object ValidationError]')
  })
})
