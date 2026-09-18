/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { ValidationError } from '../../src/errors/validation_error.ts'

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
    } catch (error: any) {
      assert.match(error.stack.split('\n')[1], /validation_error.spec.ts/)
    }
  })

  test('point subclass stack trace to the call site', ({ assert }) => {
    class CustomValidationError extends ValidationError {
      constructor(messages: any) {
        super(messages)
      }
    }

    function createError() {
      return new CustomValidationError([{ message: 'Field is required' }])
    }

    const error = createError()
    assert.instanceOf(error, CustomValidationError)
    assert.instanceOf(error, ValidationError)
    assert.match(error.stack!.split('\n')[1], /at createError/)
  })

  test('forward error options to the base error', ({ assert }) => {
    const cause = new Error('Database connection failed')
    const error = new ValidationError([{ message: 'Field is required' }], { cause })

    assert.equal(error.cause, cause)
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
