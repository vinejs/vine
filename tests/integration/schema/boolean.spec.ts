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

test.group('Boolean', () => {
  test('fail when value is not a boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean(),
    })

    const data = {
      is_admin: 'foo',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'is_admin',
        message: 'The value must be a boolean',
        rule: 'boolean',
      },
    ])
  })

  test('pass when value is a boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean(),
    })

    const data = {
      is_admin: false,
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      is_admin: false,
    })
  })

  test('pass when value is a string representation of boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean(),
    })

    const data = {
      is_admin: 'true',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      is_admin: true,
    })
  })
})

test.group('Boolean | strict mode', () => {
  test('fail when when is not a boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean({ strict: true }),
    })

    const data = {
      is_admin: 'foo',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'is_admin',
        message: 'The value must be a boolean',
        rule: 'boolean',
      },
    ])
  })

  test('pass when value is a boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean({ strict: true }),
    })

    const data = {
      is_admin: false,
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      is_admin: false,
    })
  })

  test('fail when value is a string representation of boolean', async ({ assert }) => {
    const schema = vine.object({
      is_admin: vine.boolean({ strict: true }),
    })

    const data = {
      is_admin: 'true',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'is_admin',
        message: 'The value must be a boolean',
        rule: 'boolean',
      },
    ])
  })
})
