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

test.group('VineNumber', () => {
  test('fail when value is not a number', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number().withoutDecimals(),
    })

    const data = { age: 'foo' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'age',
        message: 'The age field must be a number',
        rule: 'number',
      },
    ])
  })

  test('fail when value has decimal places', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number().withoutDecimals(),
    })

    const data = { age: '22.12' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'age',
        message: 'The age field must be an integer',
        rule: 'withoutDecimals',
      },
    ])
  })

  test('pass when value is a valid integer', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number().withoutDecimals(),
    })

    const data = { age: '22' }
    await assert.validationOutput(vine.validate({ schema, data }), {
      age: 22,
    })
  })
})
