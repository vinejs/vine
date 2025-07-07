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
  isFileRule,
  maxSizeRule,
  minSizeRule,
  mimeTypesRule,
} from '../../../src/schema/file/rules.js'

test.group('File | isFileRule', () => {
  test('should pass when value is a valid file', () => {
    const rule = isFileRule()
    const file = new File([''], 'file.txt')
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('should fail when value is not a file', () => {
    const rule = isFileRule()
    const validated = validator.execute(rule, 123)
    validated.assertError('The dummy field must be a valid file')
  })
})

test.group('File | minSizeRule', () => {
  test('should pass when file size is greater than or equal to the minimum size', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = new File(['a'.repeat(1030)], 'file.txt') // 1 KB file
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('does not run when its not valid', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = new File(['a'.repeat(1030)], 'file.txt') // 1 KB file
    const validated = validator.withContext({ isValid: false }).execute(rule, file)
    validated.assertSucceeded()
  })

  test('does not run when its not a file', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = 'string'
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('should fail when file size is less than the minimum size', () => {
    const rule = minSizeRule({ min: 1024 }) // 1 KB
    const file = new File(['a'.repeat(512)], 'file.txt') // 512 bytes file
    const validated = validator.execute(rule, file)
    validated.assertError('The dummy field must be at least 1024 bytes in size')
  })
})

test.group('File | maxSizeRule', () => {
  test('should pass when file size is less than or equal to the maximum size', () => {
    const rule = maxSizeRule({ max: 2048 }) // 2 KB
    const file = new File(['a'.repeat(2030)], 'file.txt') // 2 KB file
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('should fail when file size is greater than the maximum size', () => {
    const rule = maxSizeRule({ max: 2048 }) // 2 KB
    const file = new File(['a'.repeat(3072)], 'file.txt') // 3 KB file
    const validated = validator.execute(rule, file)
    validated.assertError('The dummy field must not exceed 2048 bytes in size')
  })

  test('should not run when is not valid', () => {
    const rule = maxSizeRule({ max: 2048 }) // 2 KB
    const file = new File(['a'.repeat(1030)], 'file.txt') // 1 KB file
    const validated = validator.withContext({ isValid: false }).execute(rule, file)
    validated.assertSucceeded()
  })

  test('should not run when is not a file', () => {
    const rule = maxSizeRule({ max: 2048 }) // 2 KB
    const file = 'string'
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })
})

test.group('File | mimeTypesRule', () => {
  test('should pass when file has an allowed MIME type', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('does not run when is not a file', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = 'string'
    const validated = validator.execute(rule, file)
    validated.assertSucceeded()
  })

  test('does not run when is not valid', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const validated = validator.withContext({ isValid: false }).execute(rule, file)
    validated.assertSucceeded()
  })

  test('should fail when file has a disallowed MIME type', () => {
    const rule = mimeTypesRule({ mimeTypes: ['text/plain', 'application/json'] })
    const file = new File([''], 'file.txt', { type: 'image/png' })
    const validated = validator.execute(rule, file)
    validated.assertError(
      'The dummy field must be one of the following mime types: text/plain,application/json'
    )
  })
})
