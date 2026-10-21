/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine from '../../../index.ts'

test.group('File', () => {
  test('fail when value is not a file', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile(),
    })

    const data = { file: 'not-a-file' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        message: 'The file field must be a valid file',
        rule: 'nativeFile',
      },
    ])
  })

  test('fail when file size exceeds the limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile().maxSize(2 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(3 * 1024 * 1024)], 'file.txt') }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        meta: {
          max: 2 * 1024 * 1024,
        },
        message: `The file field must not exceed ${2 * 1024 * 1024} bytes in size`,
        rule: 'nativeFile.maxSize',
      },
    ])
  })

  test('pass when value is a valid file within size limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile().maxSize(2 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(1 * 1024 * 1024)], 'file.text') }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('fail when file size is below the minimum limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile().minSize(1 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(512 * 1024)], 'file.txt') }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        meta: {
          min: 1 * 1024 * 1024,
        },
        message: `The file field must be at least ${1 * 1024 * 1024} bytes in size`,
        rule: 'nativeFile.minSize',
      },
    ])
  })

  test('fail when value is not a valid MIME type', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile().mimeTypes(['text/plain']),
    })

    const data = {
      file: new File([''], 'file.txt', { type: 'image/png' }),
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        message: 'The file mime type is invalid',
        meta: {
          mimeTypes: ['text/plain'],
        },
        rule: 'nativeFile.mimeTypes',
      },
    ])
  })

  test('pass when value is a valid MIME type', async ({ assert }) => {
    const schema = vine.object({
      file: vine.nativeFile().mimeTypes(['text/plain']),
    })

    const data = {
      file: new File([''], 'file.txt', { type: 'text/plain' }),
    }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})
