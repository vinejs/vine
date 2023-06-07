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
      terms: vine.accepted(),
    })

    const data = {}

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'terms',
        message: 'The terms field must be defined',
        rule: 'required',
      },
    ])
  })

  test('fail when field is defined but not accepted', async ({ assert }) => {
    const schema = vine.object({
      terms: vine.accepted(),
    })

    const data = {
      terms: 'no',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'terms',
        message: 'The terms field must be accepted',
        rule: 'accepted',
      },
    ])
  })

  test('pass when field is accepted', async ({ assert }) => {
    const schema = vine.object({
      terms: vine.boolean(),
    })

    const data = {
      terms: 'on',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      terms: true,
    })
  })
})
