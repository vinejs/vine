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
  compactRule,
  distinctRule,
  notEmptyRule,
  maxLengthRule,
  minLengthRule,
  fixedLengthRule,
} from '../../../src/schema/array/rules.js'

test.group('Array | minLength', () => {
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

  test('report when array length is less than the expected length', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator.execute(minLength, ['foo'])

    validated.assertError('The dummy field must have at least 2 items')
  })

  test('pass validation when length is same or greater than expected length', () => {
    const minLength = minLengthRule({ min: 2 })
    const validated = validator.execute(minLength, ['foo', 'bar'])
    validated.assertSucceeded()
    validated.assertOutput(['foo', 'bar'])

    const validated1 = validator.execute(minLength, ['foo', 'bar', 'baz'])
    validated1.assertSucceeded()
    validated1.assertOutput(['foo', 'bar', 'baz'])
  })
})

test.group('Array | maxLength', () => {
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

  test('report when array length is greater than the expected length', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar', 'baz'])

    validated.assertError('The dummy field must not have more than 2 items')
  })

  test('pass validation when length is same or less than expected length', () => {
    const maxLength = maxLengthRule({ max: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar'])
    validated.assertSucceeded()
    validated.assertOutput(['foo', 'bar'])

    const validated1 = validator.execute(maxLength, ['foo'])
    validated1.assertSucceeded()
    validated1.assertOutput(['foo'])
  })
})

test.group('Array | fixedLength', () => {
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

  test('report when array length is greater than the expected length', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(fixedLength, ['foo', 'bar', 'baz'])

    validated.assertError('The dummy field must contain 2 items')
  })

  test('report when array length is less than the expected length', () => {
    const fixedLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(fixedLength, ['foo'])

    validated.assertError('The dummy field must contain 2 items')
  })

  test('pass validation when length is same as the expected length', () => {
    const maxLength = fixedLengthRule({ size: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar'])
    validated.assertSucceeded()
    validated.assertOutput(['foo', 'bar'])
  })
})

test.group('Array | notEmpty', () => {
  test('skip when field is invalid', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.withContext({ isValid: false }).execute(notEmpty, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.withContext({ isValid: false }).bail(false).execute(notEmpty, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('report when array is empty', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.execute(notEmpty, [])

    validated.assertError('The dummy field must not be empty')
  })

  test('pass validation when array has one or more items', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.execute(notEmpty, ['foo', 'bar'])
    validated.assertSucceeded()
    validated.assertOutput(['foo', 'bar'])
  })
})

test.group('Array | distinct', () => {
  test('skip when field is invalid', () => {
    const distinct = distinctRule({})
    const validated = validator.withContext({ isValid: false }).execute(distinct, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const distinct = distinctRule({})
    const validated = validator.withContext({ isValid: false }).bail(false).execute(distinct, 'foo')

    validated.assertSucceeded()
    validated.assertOutput('foo')
  })

  test('pass validation when array is empty', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, [])

    validated.assertSucceeded()
  })

  test('pass validation when array has unique items', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, ['foo', 'bar', 'baz'])
    validated.assertSucceeded()

    const validated1 = validator.execute(distinct, [11, 12, 13])
    validated1.assertSucceeded()

    const validated2 = validator.execute(distinct, [true, false])
    validated2.assertSucceeded()
  })

  test('report error when array has duplicates', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, ['foo', 'bar', 'foo'])
    validated.assertError('The dummy field has duplicate values')

    const validated1 = validator.execute(distinct, [11, 12, 11])
    validated1.assertError('The dummy field has duplicate values')

    const validated2 = validator.execute(distinct, [true, true])
    validated2.assertError('The dummy field has duplicate values')
  })

  test('pass validation when array of objects have unique items', () => {
    const distinct = distinctRule({ fields: 'email' })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
      },
      {
        email: 'baz@bar.com',
      },
    ])

    validated.assertSucceeded()
  })

  test('report error when array of objects has duplicate items', () => {
    const distinct = distinctRule({ fields: 'email' })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
      },
      {
        email: 'foo@bar.com',
      },
    ])
    validated.assertError('The dummy field has duplicate values')
  })

  test('pass validation when object has unique items for a composite key', () => {
    const distinct = distinctRule({ fields: ['email', 'company_id'] })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
        company_id: 1,
      },
      {
        email: 'foo@bar.com',
        company_id: 2,
      },
    ])

    validated.assertSucceeded()
  })

  test('report error when object has duplicate items for a composite key', () => {
    const distinct = distinctRule({ fields: ['email', 'company_id'] })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
        company_id: 1,
      },
      {
        email: 'foo@bar.com',
        company_id: 1,
      },
    ])

    validated.assertError('The dummy field has duplicate values')
  })

  test('skip when one or more fields are missing in objects', () => {
    const distinct = distinctRule({ fields: ['email', 'company_id'] })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
      },
      {
        email: 'foo@bar.com',
      },
    ])

    validated.assertSucceeded()
  })

  test('skip when array elements are not objects', () => {
    const distinct = distinctRule({ fields: ['email', 'company_id'] })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
      },
      'foo@bar.com',
    ])

    validated.assertSucceeded()
  })
})

test.group('Array | compact', () => {
  test('skip when field is invalid', () => {
    const compact = compactRule()
    const validated = validator.withContext({ isValid: false }).execute(compact, 'foo')
    validated.assertOutput('foo')
  })

  test('skip when field is invalid and bail mode is disabled', () => {
    const compact = compactRule()
    const validated = validator.withContext({ isValid: false }).bail(false).execute(compact, 'foo')
    validated.assertOutput('foo')
  })

  test('remove empty strings null and undefined values', () => {
    const compact = compactRule()
    const validated = validator.execute(compact, [
      'foo',
      'bar',
      '',
      null,
      undefined,
      'baz',
      null,
      true,
      false,
      1,
      0,
    ])

    validated.assertOutput(['foo', 'bar', 'baz', true, false, 1, 0])
  })
})
