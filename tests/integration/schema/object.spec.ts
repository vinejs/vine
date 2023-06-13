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

test.group('VineObject | flat object', () => {
  test('fail when value is not an object', async ({ assert }) => {
    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const data = 'foo'
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: '',
        message: 'The  field must be an object',
        rule: 'object',
      },
    ])
  })

  test('fail when object has missing properties', async ({ assert }) => {
    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'username',
        message: 'The username field must be defined',
        rule: 'required',
      },
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass when object has all the properties', async ({ assert }) => {
    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const data = {
      username: 'virk',
      password: 'secret',
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('drop unknown properties', async ({ assert }) => {
    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const data = {
      username: 'virk',
      password: 'secret',
      rememberMe: true,
      trackLogin: true,
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      username: 'virk',
      password: 'secret',
    })
  })

  test('merge properties from an existing object', async ({ assert }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
    })

    const schema = vine.object({
      ...author.getProperties(),
      body: vine.string(),
    })

    const data = {
      name: 'virk',
      email: 'foo@bar.com',
      body: 'This is post 101',
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})

test.group('VineObject | allow unknown properties', () => {
  test('fail when value is not an object', async ({ assert }) => {
    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .allowUnknownProperties()

    const data = 'foo'
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: '',
        message: 'The  field must be an object',
        rule: 'object',
      },
    ])
  })

  test('fail when object has missing properties', async ({ assert }) => {
    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .allowUnknownProperties()

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'username',
        message: 'The username field must be defined',
        rule: 'required',
      },
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
    ])
  })

  test('copy unknown properties to the output', async ({ assert }) => {
    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .allowUnknownProperties()

    const data = {
      username: 'virk',
      password: 'secret',
      rememberMe: true,
      trackLogin: true,
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})

test.group('VineObject | object group', () => {
  test('fail when group schema reports error', async ({ assert }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        guide_id: vine.string(),
        amount: vine.number(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        name: vine.string(),
        group_size: vine.number(),
        phone_number: vine.string(),
      })
      .merge(guideSchema)

    const data = {
      name: 'virk',
      group_size: 10,
      phone_number: '0001010',
      is_hiring_guide: true,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'guide_id',
        message: 'The guide_id field must be defined',
        rule: 'required',
      },
      {
        field: 'amount',
        message: 'The amount field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass when group schema is valid', async ({ assert }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        guide_id: vine.string(),
        amount: vine.number(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        name: vine.string(),
        group_size: vine.number(),
        phone_number: vine.string(),
      })
      .merge(guideSchema)

    const data = {
      name: 'virk',
      group_size: 10,
      phone_number: '0001010',
      is_hiring_guide: false,
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      name: 'virk',
      group_size: 10,
      phone_number: '0001010',
      is_hiring_guide: false,
    })
  })

  test('pass when none of the group conditions match', async ({ assert }) => {
    const fiscalHost = vine.group([
      vine.group.if((data) => data.type === 'stripe', {
        type: vine.literal('stripe'),
        account_id: vine.string(),
      }),
      vine.group.if((data) => data.type === 'paypal', {
        type: vine.literal('paypal'),
        email: vine.string().email(),
      }),
      vine.group.if((data) => data.type === 'open_collective', {
        type: vine.literal('open_collective'),
        project_url: vine.string(),
      }),
    ])

    const schema = vine.object({}).merge(fiscalHost)

    const data = {}
    await assert.validationOutput(vine.validate({ schema, data }), {})
  })

  test('fail when group reports an error', async ({ assert }) => {
    const fiscalHost = vine
      .group([
        vine.group.if((data) => data.type === 'stripe', {
          type: vine.literal('stripe'),
          account_id: vine.string(),
        }),
        vine.group.if((data) => data.type === 'paypal', {
          type: vine.literal('paypal'),
          email: vine.string().email(),
        }),
        vine.group.if((data) => data.type === 'open_collective', {
          type: vine.literal('open_collective'),
          project_url: vine.string(),
        }),
      ])
      .otherwise((_, field) => {
        field.report('Missing type property', 'type', field)
      })

    const schema = vine.object({}).merge(fiscalHost)

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: '',
        message: 'Missing type property',
        rule: 'type',
      },
    ])
  })
})
