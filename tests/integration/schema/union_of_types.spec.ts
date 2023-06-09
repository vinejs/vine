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

test.group('UnionOfTypes', () => {
  test('bypass when none of the union conditions match', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {}
    await assert.validationOutput(vine.validate({ schema, data }), {})
  })

  test('report error when union schema reports error', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {
      health_check: 'foo',
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        rule: 'url',
        field: 'health_check',
        message: 'The health_check field must be a valid URL',
      },
    ])
  })

  test('pass validation when data is valid as per union schema', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {
      health_check: 'https://foo.com',
    }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('report error using otherwise callback', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]).otherwise((_, ctx) => {
        ctx.report('The health_check url must be a boolean or string', 'invalid_url', ctx)
      }),
    })

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'health_check',
        message: 'The health_check url must be a boolean or string',
        rule: 'invalid_url',
      },
    ])
  })
})
