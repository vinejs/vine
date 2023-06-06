/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { refsBuilder } from '@vinejs/compiler'

import { PARSE } from '../../../src/symbols.js'
import { Vine } from '../../../src/vine/main.js'

const vine = new Vine()

test.group('VineRecord', () => {
  test('construct record schema', ({ assert }) => {
    const schema = vine.record(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('apply nullable modifier', ({ assert }) => {
    const schema = vine
      .record(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('apply optional modifier', ({ assert }) => {
    const schema = vine
      .record(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine
      .record(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })
})

test.group('VineRecord | clone', () => {
  test('clone record schema', ({ assert }) => {
    const schema = vine.record(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('clone and apply nullable modifier', ({ assert }) => {
    const schema = vine.record(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )
    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('clone and apply optional modifier', ({ assert }) => {
    const schema = vine.record(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })

  test('clone and disable bail mode', ({ assert }) => {
    const schema = vine.record(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: undefined,
      each: {
        type: 'object',
        fieldName: '*',
        propertyName: '*',
        bail: true,
        allowNull: false,
        isOptional: false,
        allowUnknownProperties: false,
        validations: [],
        groups: [],
        parseFnId: undefined,
        properties: [
          {
            type: 'literal',
            fieldName: 'username',
            propertyName: 'username',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://1',
              },
            ],
          },
          {
            type: 'literal',
            fieldName: 'password',
            propertyName: 'password',
            bail: true,
            allowNull: false,
            isOptional: false,
            parseFnId: undefined,
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        ],
      },
    })
  })
})
