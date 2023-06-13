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

test.group('Array | array of numbers', () => {
  test('fail when array does not have numbers', async ({ assert }) => {
    const schema = vine.object({
      categories: vine.array(vine.number()),
    })

    const data = {
      categories: [1, 'foo', 'bar', 11],
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'categories.*',
        index: 1,
        message: 'The 1 field must be a number',
        rule: 'number',
      },
      {
        field: 'categories.*',
        index: 2,
        message: 'The 2 field must be a number',
        rule: 'number',
      },
    ])
  })

  test('pass when array has numbers and numerical strings', async ({ assert }) => {
    const schema = vine.object({
      categories: vine.array(vine.number()),
    })

    const data = {
      categories: [1, '2', '20', 11],
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      categories: [1, 2, 20, 11],
    })
  })
})

test.group('Array | array of objects', () => {
  test('fail when array does not have an object', async ({ assert }) => {
    const schema = vine.object({
      contacts: vine.array(
        vine.object({
          id: vine.number(),
          is_primary: vine.boolean(),
        })
      ),
    })

    const data = {
      contacts: ['foo'],
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'contacts.*',
        index: 0,
        message: 'The 0 field must be an object',
        rule: 'object',
      },
    ])
  })

  test('pass when array has objects matching the desired shape', async ({ assert }) => {
    const schema = vine.object({
      contacts: vine.array(
        vine.object({
          id: vine.number(),
          is_primary: vine.boolean(),
        })
      ),
    })

    const data = {
      contacts: [
        { id: 1, is_primary: false },
        { id: 2, is_primary: true },
      ],
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})

test.group('Array | array of unions', () => {
  test('pass when none of the union conditions match', async ({ assert }) => {
    /**
     * Re-usable helper to check if the field value
     * is an object and has a matching type
     */
    function hasType(value: unknown, type: string) {
      return vine.helpers.isObject(value) && value.type === type
    }

    /**
     * Schema type for email contact
     */
    const emailContact = vine.object({
      type: vine.literal('email'),
      email: vine.string().email(),
    })

    /**
     * Schema type for phone contact
     */
    const phoneContact = vine.object({
      type: vine.literal('phone'),
      phone: vine.string().mobile(),
    })

    /**
     * Define a contact union with conditionals and
     * their associated schema
     */
    const contact = vine.union([
      vine.union.if((value) => hasType(value, 'email'), emailContact),
      vine.union.if((value) => hasType(value, 'phone'), phoneContact),
    ])

    const schema = vine.object({
      contacts: vine.array(contact),
    })

    const data = {
      contacts: ['foo'],
    }

    await assert.validationOutput(vine.validate({ schema, data }), { contacts: [] })
  })

  test('fail when union reports an error', async ({ assert }) => {
    /**
     * Re-usable helper to check if the field value
     * is an object and has a matching type
     */
    function hasType(value: unknown, type: string) {
      return vine.helpers.isObject(value) && value.type === type
    }

    /**
     * Schema type for email contact
     */
    const emailContact = vine.object({
      type: vine.literal('email'),
      email: vine.string().email(),
    })

    /**
     * Schema type for phone contact
     */
    const phoneContact = vine.object({
      type: vine.literal('phone'),
      phone: vine.string().mobile(),
    })

    /**
     * Define a contact union with conditionals and
     * their associated schema
     */
    const contact = vine
      .union([
        vine.union.if((value) => hasType(value, 'email'), emailContact),
        vine.union.if((value) => hasType(value, 'phone'), phoneContact),
      ])
      .otherwise((_, field) => {
        field.report(
          'Invalid contact. Either provide an email or a phone number',
          'unknown_contact_type',
          field
        )
      })

    const schema = vine.object({
      contacts: vine.array(contact),
    })

    const data = {
      contacts: ['foo'],
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'contacts.*',
        index: 0,
        message: 'Invalid contact. Either provide an email or a phone number',
        rule: 'unknown_contact_type',
      },
    ])
  })

  test('fail when union schema reports error', async ({ assert }) => {
    /**
     * Re-usable helper to check if the field value
     * is an object and has a matching type
     */
    function hasType(value: unknown, type: string) {
      return vine.helpers.isObject(value) && value.type === type
    }

    /**
     * Schema type for email contact
     */
    const emailContact = vine.object({
      type: vine.literal('email'),
      email: vine.string().email(),
    })

    /**
     * Schema type for phone contact
     */
    const phoneContact = vine.object({
      type: vine.literal('phone'),
      phone: vine.string().mobile(),
    })

    /**
     * Define a contact union with conditionals and
     * their associated schema
     */
    const contact = vine
      .union([
        vine.union.if((value) => hasType(value, 'email'), emailContact),
        vine.union.if((value) => hasType(value, 'phone'), phoneContact),
      ])
      .otherwise((_, field) => {
        field.report(
          'Invalid contact. Either provide an email or a phone number',
          'unknown_contact_type',
          field
        )
      })

    const schema = vine.object({
      contacts: vine.array(contact),
    })

    const data = {
      contacts: [
        {
          type: 'email',
          email: 'foo',
        },
      ],
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'contacts.*.email',
        message: 'The email field must be a valid email address',
        rule: 'email',
      },
    ])
  })

  test('pass when union schema is valid', async ({ assert }) => {
    assert.plan(1)

    /**
     * Re-usable helper to check if the field value
     * is an object and has a matching type
     */
    function hasType(value: unknown, type: string) {
      return vine.helpers.isObject(value) && value.type === type
    }

    /**
     * Schema type for email contact
     */
    const emailContact = vine.object({
      type: vine.literal('email'),
      email: vine.string().email(),
    })

    /**
     * Schema type for phone contact
     */
    const phoneContact = vine.object({
      type: vine.literal('phone'),
      phone: vine.string().mobile(),
    })

    /**
     * Define a contact union with conditionals and
     * their associated schema
     */
    const contact = vine
      .union([
        vine.union.if((value) => hasType(value, 'email'), emailContact),
        vine.union.if((value) => hasType(value, 'phone'), phoneContact),
      ])
      .otherwise((_, field) => {
        field.report(
          'Invalid contact. Either provide an email or a phone number',
          'unknown_contact_type',
          field
        )
      })

    const schema = vine.object({
      contacts: vine.array(contact),
    })

    const data = {
      contacts: [
        {
          type: 'email' as const,
          email: 'foo@bar.com',
        },
      ],
    }

    await assert.validationOutput(vine.validate({ schema, data }), data)
  })
})
