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
import { Infer } from '../../../src/types.js'
// import { requiredWhen } from '../../../src/schema/base/rules.js'

test.group('UnionOfTypes', () => {
  test('report error when none of the unions match', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        rule: 'unionOfTypes',
        field: 'health_check',
        message: 'Invalid value provided for health_check field',
      },
    ])
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
      health_check: vine
        .unionOfTypes([vine.boolean(), vine.string().url()])
        .otherwise((_, field) => {
          field.report('The health_check url must be a boolean or string', 'invalid_url', field)
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

  test('allow undefined and null values using vine.optional()', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.optional(), vine.boolean(), vine.string().url()]),
    })

    await assert.validationOutput(vine.validate({ schema, data: {} }), {})
    await assert.validationOutput(vine.validate({ schema, data: { health_check: undefined } }), {})
    await assert.validationOutput(vine.validate({ schema, data: { health_check: null } }), {})
  })

  test('conditionally mark field as required via vine.optional', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([
        vine.optional().requiredWhen(() => true),
        vine.boolean(),
        vine.string().url(),
      ]),
    })

    await assert.validationErrors(vine.validate({ schema, data: {} }), [
      {
        field: 'health_check',
        message: 'The health_check field must be defined',
        rule: 'required',
      },
    ])
    await assert.validationErrors(vine.validate({ schema, data: { health_check: undefined } }), [
      {
        field: 'health_check',
        message: 'The health_check field must be defined',
        rule: 'required',
      },
    ])
    await assert.validationErrors(vine.validate({ schema, data: { health_check: null } }), [
      {
        field: 'health_check',
        message: 'The health_check field must be defined',
        rule: 'required',
      },
    ])
  })

  test('move to other unions when field is defined', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([
        vine.optional().requiredWhen(() => true),
        vine.boolean(),
        vine.string().url(),
      ]),
    })

    await assert.validationOutput(vine.validate({ schema, data: { health_check: '1' } }), {
      health_check: true,
    })
  })

  test('output null value using nullable modifier', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([
        vine.optional().nullable(),
        vine.boolean(),
        vine.string().url(),
      ]),
    })

    await assert.validationOutput(vine.validate({ schema, data: {} }), {})
    await assert.validationOutput(vine.validate({ schema, data: { health_check: undefined } }), {})
    await assert.validationOutput(vine.validate({ schema, data: { health_check: null } }), {
      health_check: null,
    })
  })

  test('allow null value using vine.null', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.null(), vine.boolean(), vine.string().url()]),
    })

    await assert.validationErrors(vine.validate({ schema, data: {} }), [
      {
        field: 'health_check',
        message: 'Invalid value provided for health_check field',
        rule: 'unionOfTypes',
      },
    ])
    await assert.validationErrors(vine.validate({ schema, data: { health_check: undefined } }), [
      {
        field: 'health_check',
        message: 'Invalid value provided for health_check field',
        rule: 'unionOfTypes',
      },
    ])
    await assert.validationOutput(vine.validate({ schema, data: { health_check: null } }), {
      health_check: null,
    })
  })

  test('disallow duplicate types', async ({ assert }) => {
    assert.throws(
      () => vine.unionOfTypes([vine.string().email(), vine.string().url()]),
      'Cannot use duplicate schema "vine.string". "vine.unionOfTypes" needs distinct schema types only'
    )

    assert.throws(
      () => vine.unionOfTypes([vine.record(vine.string()), vine.record(vine.number())]),
      'Cannot use duplicate schema "vine.object". "vine.unionOfTypes" needs distinct schema types only'
    )
  })

  test('disallow union inside union of types', async ({ assert }) => {
    assert.throws(
      () => vine.unionOfTypes([vine.union([])]),
      'Cannot use "VineUnion". The schema type is not compatible for use with "vine.unionOfTypes"'
    )
  })

  test('define unionOf number, literal and optional', async ({ assert, expectTypeOf }) => {
    const schema = vine.object({
      rating: vine
        .unionOfTypes([vine.number().min(0).max(5), vine.literal('*')])
        .optional()
        .nullable(),
    })

    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{
      rating?: undefined | null | number | '*'
    }>()
    await assert.validationOutput(vine.validate({ schema, data: {} }), {})
    await assert.validationOutput(vine.validate({ schema, data: { rating: undefined } }), {})
    await assert.validationOutput(vine.validate({ schema, data: { rating: null } }), {
      rating: null,
    })
    await assert.validationOutput(vine.validate({ schema, data: { rating: '5' } }), {
      rating: 5,
    })
    await assert.validationOutput(vine.validate({ schema, data: { rating: '*' } }), {
      rating: '*',
    })
    await assert.validationErrors(vine.validate({ schema, data: { rating: 'foo' } }), [
      {
        field: 'rating',
        rule: 'unionOfTypes',
        message: 'Invalid value provided for rating field',
      },
    ])
  }).tags(['#75'])

  test('define unionOf string, array of strings and optional', async ({ assert, expectTypeOf }) => {
    const schema = vine.object({
      type: vine.unionOfTypes([vine.string(), vine.array(vine.string())]).optional(),
    })

    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<{
      type?: string | string[] | undefined
    }>()

    await assert.validationOutput(vine.validate({ schema, data: {} }), {})
    await assert.validationOutput(vine.validate({ schema, data: { type: undefined } }), {})
    await assert.validationOutput(vine.validate({ schema, data: { type: null } }), {})
    await assert.validationOutput(vine.validate({ schema, data: { type: 'created' } }), {
      type: 'created',
    })
    await assert.validationOutput(vine.validate({ schema, data: { type: ['created'] } }), {
      type: ['created'],
    })
    await assert.validationErrors(vine.validate({ schema, data: { type: 10 } }), [
      {
        field: 'type',
        rule: 'unionOfTypes',
        message: 'Invalid value provided for type field',
      },
    ])
  }).tags(['#75'])

  test('define optional union', async ({ assert }) => {
    const emailField = vine.string().email()
    const emailSchema = vine.object({
      email: emailField.clone(),
    })
    const phoneSchema = vine.object({
      phone: vine.string().mobile(),
    })

    const contact = vine
      .union([
        vine.union.if((value) => vine.helpers.isString(value), emailField),
        vine.union.if((value) => vine.helpers.isObject(value) && 'email' in value, emailSchema),
        vine.union.if((value) => vine.helpers.isObject(value) && 'phone' in value, phoneSchema),
      ])
      .optional()

    const schema = vine.object({
      contact,
    })

    await assert.validationOutput(vine.validate({ schema, data: {} }), {})
    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: undefined,
        },
      }),
      {}
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: null,
        },
      }),
      {}
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: 'foo@bar.com',
        },
      }),
      {
        contact: 'foo@bar.com',
      }
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: {
            email: 'foo@bar.com',
          },
        },
      }),
      {
        contact: {
          email: 'foo@bar.com',
        },
      }
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: {
            phone: '123456789',
          },
        },
      }),
      {
        contact: {
          phone: '123456789',
        },
      }
    )

    await assert.validationErrors(
      vine.validate({
        schema,
        data: {
          contact: {},
        },
      }),
      [
        {
          field: 'contact',
          message: 'Invalid value provided for contact field',
          rule: 'union',
        },
      ]
    )
  })

  test('define nullable union', async ({ assert }) => {
    const emailField = vine.string().email()
    const emailSchema = vine.object({
      email: emailField.clone(),
    })
    const phoneSchema = vine.object({
      phone: vine.string().mobile(),
    })

    const contact = vine
      .union([
        vine.union.if((value) => vine.helpers.isString(value), emailField),
        vine.union.if((value) => vine.helpers.isObject(value) && 'email' in value, emailSchema),
        vine.union.if((value) => vine.helpers.isObject(value) && 'phone' in value, phoneSchema),
      ])
      .nullable()

    const schema = vine.object({
      contact,
    })

    await assert.validationErrors(vine.validate({ schema, data: {} }), [
      {
        field: 'contact',
        message: 'Invalid value provided for contact field',
        rule: 'union',
      },
    ])
    await assert.validationErrors(
      vine.validate({
        schema,
        data: {
          contact: undefined,
        },
      }),
      [
        {
          field: 'contact',
          message: 'Invalid value provided for contact field',
          rule: 'union',
        },
      ]
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: null,
        },
      }),
      {
        contact: null,
      }
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: 'foo@bar.com',
        },
      }),
      {
        contact: 'foo@bar.com',
      }
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: {
            email: 'foo@bar.com',
          },
        },
      }),
      {
        contact: {
          email: 'foo@bar.com',
        },
      }
    )

    await assert.validationOutput(
      vine.validate({
        schema,
        data: {
          contact: {
            phone: '123456789',
          },
        },
      }),
      {
        contact: {
          phone: '123456789',
        },
      }
    )

    await assert.validationErrors(
      vine.validate({
        schema,
        data: {
          contact: {},
        },
      }),
      [
        {
          field: 'contact',
          message: 'Invalid value provided for contact field',
          rule: 'union',
        },
      ]
    )
    await assert.validationErrors(vine.validate({ schema, data: {} }), [
      {
        field: 'contact',
        message: 'Invalid value provided for contact field',
        rule: 'union',
      },
    ])
    await assert.validationErrors(
      vine.validate({
        schema,
        data: {
          contact: undefined,
        },
      }),
      [
        {
          field: 'contact',
          message: 'Invalid value provided for contact field',
          rule: 'union',
        },
      ]
    )
  })
})
