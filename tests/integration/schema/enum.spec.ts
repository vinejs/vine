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

test.group('Enum', () => {
  test('fail when value is not a subset of choices', async ({ assert }) => {
    const schema = vine.object({
      role: vine.enum(['admin', 'moderator', 'owner', 'user']),
    })

    const data = {
      role: 'foo',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'role',
        message: 'The selected role is invalid',
        rule: 'enum',
        meta: {
          choices: ['admin', 'moderator', 'owner', 'user'],
        },
      },
    ])
  })

  test('pass when value is a subset of choices', async ({ assert }) => {
    const schema = vine.object({
      role: vine.enum(['admin', 'moderator', 'owner', 'user']),
    })

    const data = {
      role: 'admin',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      role: 'admin',
    })
  })
})

test.group('Enum | Native enum', () => {
  test('fail when value is not a subset of choices', async ({ assert }) => {
    enum Roles {
      ADMIN = 'admin',
      MOD = 'moderator',
      OWNER = 'owner',
      USER = 'user',
    }

    const schema = vine.object({
      role: vine.enum(Roles),
    })

    const data = {
      role: 'foo',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'role',
        message: 'The selected role is invalid',
        rule: 'enum',
        meta: {
          choices: ['admin', 'moderator', 'owner', 'user'],
        },
      },
    ])
  })

  test('pass when value is a subset of choices', async ({ assert }) => {
    enum Roles {
      ADMIN = 'admin',
      MOD = 'moderator',
      OWNER = 'owner',
      USER = 'user',
    }

    const schema = vine.object({
      role: vine.enum(Roles),
    })

    const data = {
      role: 'admin',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      role: 'admin',
    })
  })
})

test.group('Enum | Lazily compute enum choices', () => {
  test('fail when value is not a subset of choices', async ({ assert }) => {
    const schema = vine.object({
      creative_device: vine.enum(['mobile', 'desktop']),
      banner_width: vine.enum((ctx) => {
        if (ctx.parent.creative_device === 'mobile') {
          return ['320px', '640px'] as const
        }

        return ['1080px', '1280px'] as const
      }),
    })

    const data = {
      creative_device: 'desktop',
      banner_width: '640px',
    }

    const messagesProvider = new SimpleMessagesProvider({}, { banner_width: 'banner width' })
    await assert.validationErrors(vine.validate({ schema, data, messagesProvider }), [
      {
        field: 'banner_width',
        message: 'The selected banner width is invalid',
        rule: 'enum',
        meta: {
          choices: ['1080px', '1280px'],
        },
      },
    ])
  })

  test('pass when value is a subset of choices', async ({ assert }) => {
    const schema = vine.object({
      creative_device: vine.enum(['mobile', 'desktop']),
      banner_width: vine.enum((ctx) => {
        if (ctx.parent.creative_device === 'mobile') {
          return ['320px', '640px'] as const
        }

        return ['1080px', '1280px'] as const
      }),
    })

    const data = {
      creative_device: 'mobile',
      banner_width: '640px',
    }

    const messagesProvider = new SimpleMessagesProvider({}, { banner_width: 'banner width' })
    await assert.validationOutput(vine.validate({ schema, data, messagesProvider }), data)
  })
})
