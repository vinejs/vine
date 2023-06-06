/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Vine } from '../../src/vine/main.js'

const vine = new Vine()

test.group('String', () => {
  test('fail when value is not a string', async ({ assert }) => {
    assert.plan(1)

    const schema = vine.schema({
      username: vine.string(),
    })
    const data = {
      username: 22,
    }

    try {
      await vine.validate({ schema, data })
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'username',
          message: 'The value must be a string',
        },
      ])
    }
  })

  test('pass validation when value is a string', async ({ assert }) => {
    assert.plan(1)

    const schema = vine.schema({
      username: vine.string(),
    })
    const data = {
      username: 'virk',
    }

    const output = await vine.validate({ schema, data })
    assert.deepEqual(output, { username: 'virk' })
  })
})
