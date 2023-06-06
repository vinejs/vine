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
    const minLength = minLengthRule({ expectedLength: 2 })
    const validated = validator.execute(minLength, 'foo', { isValid: false })

    validated.assertDoesNotHaveErrors()
    validated.assertOutput('foo')
  })

  test('report when array length is less than the expected length', () => {
    const minLength = minLengthRule({ expectedLength: 2 })
    const validated = validator.execute(minLength, ['foo'])

    validated.assertError('The field must have atleast 2 items')
  })

  test('pass validation when length is same or greater than expected length', () => {
    const minLength = minLengthRule({ expectedLength: 2 })
    const validated = validator.execute(minLength, ['foo', 'bar'])
    validated.assertDoesNotHaveErrors()
    validated.assertOutput(['foo', 'bar'])

    const validated1 = validator.execute(minLength, ['foo', 'bar', 'baz'])
    validated1.assertDoesNotHaveErrors()
    validated1.assertOutput(['foo', 'bar', 'baz'])
  })
})

test.group('Array | maxLength', () => {
  test('skip when field is invalid', () => {
    const maxLength = maxLengthRule({ expectedLength: 2 })
    const validated = validator.execute(maxLength, 'foo', { isValid: false })

    validated.assertDoesNotHaveErrors()
    validated.assertOutput('foo')
  })

  test('report when array length is greater than the expected length', () => {
    const maxLength = maxLengthRule({ expectedLength: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar', 'baz'])

    validated.assertError('The field must not have more than 2 items')
  })

  test('pass validation when length is same or less than expected length', () => {
    const maxLength = maxLengthRule({ expectedLength: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar'])
    validated.assertDoesNotHaveErrors()
    validated.assertOutput(['foo', 'bar'])

    const validated1 = validator.execute(maxLength, ['foo'])
    validated1.assertDoesNotHaveErrors()
    validated1.assertOutput(['foo'])
  })
})

test.group('Array | fixedLength', () => {
  test('skip when field is invalid', () => {
    const fixedLength = fixedLengthRule({ expectedLength: 2 })
    const validated = validator.execute(fixedLength, 'foo', { isValid: false })

    validated.assertDoesNotHaveErrors()
    validated.assertOutput('foo')
  })

  test('report when array length is greater than the expected length', () => {
    const fixedLength = fixedLengthRule({ expectedLength: 2 })
    const validated = validator.execute(fixedLength, ['foo', 'bar', 'baz'])

    validated.assertError('The field must have exactly 2 items')
  })

  test('report when array length is less than the expected length', () => {
    const fixedLength = fixedLengthRule({ expectedLength: 2 })
    const validated = validator.execute(fixedLength, ['foo'])

    validated.assertError('The field must have exactly 2 items')
  })

  test('pass validation when length is same as the expected length', () => {
    const maxLength = maxLengthRule({ expectedLength: 2 })
    const validated = validator.execute(maxLength, ['foo', 'bar'])
    validated.assertDoesNotHaveErrors()
    validated.assertOutput(['foo', 'bar'])
  })
})

test.group('Array | notEmpty', () => {
  test('skip when field is invalid', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.execute(notEmpty, 'foo', { isValid: false })

    validated.assertDoesNotHaveErrors()
    validated.assertOutput('foo')
  })

  test('report when array is empty', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.execute(notEmpty, [])

    validated.assertError('The field must have one or more items')
  })

  test('pass validation when array has one or more items', () => {
    const notEmpty = notEmptyRule()
    const validated = validator.execute(notEmpty, ['foo', 'bar'])
    validated.assertDoesNotHaveErrors()
    validated.assertOutput(['foo', 'bar'])
  })
})

test.group('Array | distinct', () => {
  test('skip when field is invalid', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, 'foo', { isValid: false })

    validated.assertDoesNotHaveErrors()
    validated.assertOutput('foo')
  })

  test('pass validation when array is empty', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, [])

    validated.assertDoesNotHaveErrors()
  })

  test('pass validation when array has unique items', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, ['foo', 'bar', 'baz'])
    validated.assertDoesNotHaveErrors()

    const validated1 = validator.execute(distinct, [11, 12, 13])
    validated1.assertDoesNotHaveErrors()

    const validated2 = validator.execute(distinct, [true, false])
    validated2.assertDoesNotHaveErrors()
  })

  test('report error when array has duplicates', () => {
    const distinct = distinctRule({})
    const validated = validator.execute(distinct, ['foo', 'bar', 'foo'])
    validated.assertError('The field has one or more duplicate items')

    const validated1 = validator.execute(distinct, [11, 12, 11])
    validated1.assertError('The field has one or more duplicate items')

    const validated2 = validator.execute(distinct, [true, true])
    validated2.assertError('The field has one or more duplicate items')
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

    validated.assertDoesNotHaveErrors()
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
    validated.assertError('The field has one or more duplicate items')
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

    validated.assertDoesNotHaveErrors()
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

    validated.assertError('The field has one or more duplicate items')
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

    validated.assertDoesNotHaveErrors()
  })

  test('skip when array elements are not objects', () => {
    const distinct = distinctRule({ fields: ['email', 'company_id'] })
    const validated = validator.execute(distinct, [
      {
        email: 'foo@bar.com',
      },
      'foo@bar.com',
    ])

    validated.assertDoesNotHaveErrors()
  })
})

test.group('Array | compact', () => {
  test('skip when field is invalid', () => {
    const compact = compactRule()
    const validated = validator.execute(compact, 'foo', { isValid: false })
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
