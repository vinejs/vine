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
  maxSizeRule,
  minSizeRule,
  mimeTypesRule,
  isNativeFileRule,
} from '../../../src/schema/native_file/rules.js'

test.group('File | isFileRule', () => {
  test('should pass when value is a valid file', () => {
    const rule = isNativeFileRule()
    const file = new File([''], 'file.txt')
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('should fail when value is not a file', () => {
    const rule = isNativeFileRule()
    const validated = validator.execute(rule, 123)
    validated.assertError('The dummy field must be a valid file')
  })
})

test.group('File | minSizeRule', () => {
  test('should pass when file size is greater than or equal to the minimum size', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = new File(['a'.repeat(1030)], 'file.txt') // 1 KB file
    const validated = validator.withDataTypeValidator(isNativeFileRule()).execute(rule, file)
    validated.assertSucceeded()
  })

  test('should not run additional validations when value is not a valid file', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should not run additional validations when value is not a valid file with bail mode disabled', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .bail(false)
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should fail when file size is less than the minimum size', () => {
    const rule = minSizeRule({ min: 1024 })
    const file = new File(['a'.repeat(512)], 'file.txt')

    const validated = validator.withDataTypeValidator(isNativeFileRule()).execute(rule, file)
    validated.assertError('The dummy field must be at least 1024 bytes in size')
  })
})

test.group('File | maxSizeRule', () => {
  test('should pass when file size is less than or equal to the maximum size', () => {
    const rule = maxSizeRule({ max: 2048 })
    const file = new File(['a'.repeat(2030)], 'file.txt')
    const validated = validator.withDataTypeValidator(isNativeFileRule()).execute(rule, file)
    validated.assertSucceeded()
  })

  test('should not run additional validations when value is not a valid file', () => {
    const rule = maxSizeRule({ max: 1024 })
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should not run additional validations when value is not a valid file with bail mode disabled', () => {
    const rule = maxSizeRule({ max: 1024 })
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .bail(false)
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should fail when file size is greater than or equal to the maximum size', () => {
    const rule = maxSizeRule({ max: 1024 })
    const file = new File(['a'.repeat(2030)], 'file.txt')
    const validated = validator.withDataTypeValidator(isNativeFileRule()).execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must not exceed 1024 bytes in size')
  })
})

test.group('File | mimeTypesRule', () => {
  test('should pass when file has an allowed MIME type', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const validated = validator.withDataTypeValidator(isNativeFileRule()).execute(rule, file)
    validated.assertSucceeded()
  })

  test('should not run additional validations when value is not a valid file', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should not run additional validations when value is not a valid file with bail mode disabled', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = 'foo'

    const validated = validator
      .withDataTypeValidator(isNativeFileRule())
      .withContext({ isValid: false })
      .bail(false)
      .execute(rule, file)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid file')
  })

  test('should fail when file has a disallowed MIME type', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = new File([''], 'file.txt', { type: 'image/png' })
    const validated = validator.execute(rule, file)
    validated.assertError('The dummy mime type is invalid')
  })
})
