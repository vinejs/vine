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

test.group('Accepted', () => {
  test('fail when field is missing', async ({ assert }) => {
    const schema = vine.object({
      secret_message: vine.any(),
    })

    const data = {}

    await assert.validationErrors(
      vine.validate({
        schema,
        data,
        fields: {
          secret_message: 'message',
        },
      }),
      [
        {
          field: 'secret_message',
          message: 'The message field must be defined',
          rule: 'required',
        },
      ]
    )
  })

  test('pass when field value exists', async ({ assert }) => {
    const schema = vine.object({
      secret_message: vine.any(),
    })

    const data = {
      secret_message: false,
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      secret_message: false,
    })
  })
})
