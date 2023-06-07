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
  maxLengthRule,
  minLengthRule,
  fixedLengthRule,
  validateKeysRule,
} from '../../../src/schema/record/rules.js'

test.group('Record | minLength', () => {
  test('skip when field is invalid', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator.withContext({ isValid: false }).execute(minLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator
      .withContext({ isValid: false })
      .bail(false)
      .execute(minLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('report when object length is less than the expected length', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator.execute(minLength, { foo: 'bar' })

    validated.assertError('The dummy field must have at least 2 items')
  })

  test('pass validation when length is same or greater than expected length', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator.execute(minLength, { foo: 'bar', bar: 'baz' })
    validated.assertSucceeded()
    validated.assertOutput({ foo: 'bar', bar: 'baz' })

    const validated1 = validator.execute(minLength, { foo: 'bar', bar: 'baz', baz: 'foo' })
    validated1.assertSucceeded()
    validated1.assertOutput({ foo: 'bar', bar: 'baz', baz: 'foo' })
  })
})

test.group('Record | maxLength', () => {
  test('skip when field is invalid', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator.withContext({ isValid: false }).execute(maxLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator
      .withContext({ isValid: false })
      .bail(false)
      .execute(maxLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('report when object length is greater than the expected length', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator.execute(maxLength, { foo: 'bar', bar: 'baz', baz: 'foo' })

    validated.assertError('The dummy field must not have more than 2 items')
  })

  test('pass validation when length is same or less than expected length', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator.execute(maxLength, { foo: 'bar', bar: 'baz' })
    validated.assertSucceeded()
    validated.assertOutput({ foo: 'bar', bar: 'baz' })

    const validated1 = validator.execute(maxLength, { foo: 'bar' })
    validated1.assertSucceeded()
    validated1.assertOutput({ foo: 'bar' })
  })
})

test.group('Record | fixedLength', () => {
  test('skip when field is invalid', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator.withContext({ isValid: false }).execute(fixedLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator
      .withContext({ isValid: false })
      .bail(false)
      .execute(fixedLength, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('report when object length is greater than the expected length', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(fixedLength, { foo: 'bar', bar: 'baz', baz: 'foo' })

    validated.assertError('The dummy field must contain 2 items')
  })

  test('report when object length is less than the expected length', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(fixedLength, { foo: 'bar' })

    validated.assertError('The dummy field must contain 2 items')
  })

  test('pass validation when length is same as the expected length', () => {
    const maxLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(maxLength, { foo: 'bar', bar: 'baz' })
    validated.assertSucceeded()
    validated.assertOutput({ foo: 'bar', bar: 'baz' })
  })
})

test.group('Record | validateKeys', () => {
  test('skip when field is invalid', () => {
    const validateKeys = validateKeysRule(() => {
      throw new Error('Never expected to be invoked')
    })
    const validated = validator.withContext({ isValid: false }).execute(validateKeys, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const validateKeys = validateKeysRule(() => {
      throw new Error('Never expected to be invoked')
    })
    const validated = validator
      .withContext({ isValid: false })
      .bail(false)
      .execute(validateKeys, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('invoke callback and pass object keys to it', ({ assert }) => {
    assert.plan(1)

    const validateKeys = validateKeysRule((keys) => {
      assert.deepEqual(keys, ['foo', 'bar', 'baz'])
    })

    const validated = validator.execute(validateKeys, {
      foo: 'bar',
      bar: 'baz',
      baz: 'foo',
    })

    validated.assertSucceeded()
    validated.assertOutput({
      foo: 'bar',
      bar: 'baz',
      baz: 'foo',
    })
  })

  test('fail validation when validate keys reports an error', () => {
    const validateKeys = validateKeysRule((_, ctx) => {
      ctx.report('Invalid keys', 'record.keys', ctx)
    })

    const validated = validator.execute(validateKeys, {
      foo: 'bar',
      bar: 'baz',
      baz: 'foo',
    })

    validated.assertErrorsCount(1)
    validated.assertError('Invalid keys')
  })
})
