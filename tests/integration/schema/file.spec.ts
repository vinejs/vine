/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine from '../../../index.js'

test.group('File', () => {
  test('fail when value is not a file', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file(),
    })

    const data = { file: 'not-a-file' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        message: 'The file field must be a valid file',
        rule: 'file',
      },
    ])
  })

  test('fail when file size exceeds the limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file().maxSize(2 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(3 * 1024 * 1024)], 'file.txt') } // Simulating a file of 3MB
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        meta: {
          max: 2 * 1024 * 1024,
        },
        message: `The file field must not exceed ${2 * 1024 * 1024} bytes in size`,
        rule: 'file.maxSize',
      },
    ])
  })

  test('pass when value is a valid file within size limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file().maxSize(2 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(1 * 1024 * 1024)], 'file.text') } // Simulating a file of 1MB
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('fail when file size is below the minimum limit', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file().minSize(1 * 1024 * 1024),
    })

    const data = { file: new File(['a'.repeat(512 * 1024)], 'file.txt') } // Simulating a file of 512KB
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        meta: {
          min: 1 * 1024 * 1024,
        },
        message: `The file field must be at least ${1 * 1024 * 1024} bytes in size`,
        rule: 'file.minSize',
      },
    ])
  })

  test('fail when value is not a valid MIME type', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file().mimeTypes(['text/plain']),
    })

    const data = {
      file: new File([''], 'file.txt', { type: 'image/png' }),
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'file',
        message: 'The file field must be one of the following mime types: text/plain',
        meta: {
          mimeTypes: ['text/plain'],
        },
        rule: 'file.mimeTypes',
      },
    ])
  })

  test('pass when value is a valid MIME type', async ({ assert }) => {
    const schema = vine.object({
      file: vine.file().mimeTypes(['text/plain']),
    })

    const data = {
      file: new File([''], 'file.txt', { type: 'text/plain' }),
    }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})
