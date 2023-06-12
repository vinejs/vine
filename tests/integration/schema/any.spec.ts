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
import { SimpleMessagesProvider } from '../../../src/messages_provider/simple_messages_provider.js'

test.group('Accepted', () => {
  test('fail when field is missing', async ({ assert }) => {
    const schema = vine.object({
      secret_message: vine.any(),
    })

    const data = {}
    const messagesProvider = new SimpleMessagesProvider(
      {},
      {
        secret_message: 'message',
      }
    )

    await assert.validationErrors(
      vine.validate({
        schema,
        data,
        messagesProvider,
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
