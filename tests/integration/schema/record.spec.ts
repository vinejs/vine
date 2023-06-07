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

test.group('VineRecord', () => {
  test('fail when value is not an object', async ({ assert }) => {
    const schema = vine.object({
      colors: vine.record(vine.string().hexCode()),
    })

    const data = {
      colors: 'foo',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'colors',
        message: 'The colors field must be an object',
        rule: 'object',
      },
    ])
  })

  test('pass when value is an object', async ({ assert }) => {
    const schema = vine.object({
      colors: vine.record(vine.string().hexCode()),
    })

    const data = {
      colors: {
        white: '#ffffff',
        black: '#000000',
        lime: '#99d52a',
      },
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('validate union of types')
})
