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

test.group('String', () => {
  test('fail when value is not a string', async ({ assert }) => {
    const schema = vine.object({
      name: vine.string(),
    })

    const data = { name: 42 }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'name',
        message: 'The name field must be a string',
        rule: 'string',
      },
    ])
  })

  test('fail when value is not a valid ULID', async ({ assert }) => {
    const schema = vine.object({
      id: vine.string().ulid(),
    })

    const data = { id: '01J0TMIXKWW62H0BKGQ984AS' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'id',
        message: 'The id field must be a valid ULID',
        rule: 'ulid',
      },
    ])
  })

  test('pass when value is a valid ULID', async ({ assert }) => {
    const schema = vine.object({
      id: vine.string().ulid(),
    })

    const data = { id: '01J0TMSK8WMJSTX1T2633GFA4G' }
    await assert.validationOutput(vine.validate({ schema, data }), {
      id: '01J0TMSK8WMJSTX1T2633GFA4G',
    })
  })
})
