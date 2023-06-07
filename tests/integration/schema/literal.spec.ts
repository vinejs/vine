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

test.group('Literal', () => {
  test('fail when value is not same as the expected value', async ({ assert }) => {
    const schema = vine.object({
      is_hiring_guide: vine.literal(true),
    })

    const data = {
      is_hiring_guide: false,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'is_hiring_guide',
        message: 'The is_hiring_guide field must be true',
        rule: 'literal',
        meta: {
          expectedValue: true,
        },
      },
    ])
  })

  test('pass when value is same as the expected value', async ({ assert }) => {
    const schema = vine.object({
      is_hiring_guide: vine.literal(true),
    })

    const data = {
      is_hiring_guide: 'true',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      is_hiring_guide: true,
    })
  })
})
