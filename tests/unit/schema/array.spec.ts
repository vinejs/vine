/*
 * @vinejs/vine

 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { refsBuilder } from '@vinejs/compiler'

import { Vine } from '../../../src/vine/main.js'
import type { RuleBuilder } from '../../../src/types.js'
import { IS_OF_TYPE, PARSE, VALIDATION } from '../../../src/symbols.js'
import {
  compactRule,
  distinctRule,
  notEmptyRule,
  maxLengthRule,
  minLengthRule,
  fixedLengthRule,
} from '../../../src/schema/array/rules.js'

const vine = new Vine()

test.group('VineArray', () => {
  test('construct array schema', ({ assert }) => {
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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

  test('apply rules', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .minLength(10)
      .maxLength(20)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://3',
        },
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://4',
        },
      ],
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

  test('define parser', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: 'ref://3',
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

  test('convert property name to camelcase', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .parse(() => {})

    assert.deepEqual(schema[PARSE]('app_users', refsBuilder(), { toCamelCase: true }), {
      type: 'array',
      fieldName: 'app_users',
      propertyName: 'appUsers',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: 'ref://3',
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

  test('check if value is an array using IS_OF_TYPE method', ({ assert }) => {
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    assert.isTrue(schema[IS_OF_TYPE]([]))
    assert.isFalse(schema[IS_OF_TYPE]({}))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE](''))
  })
})

test.group('VineArray | clone', () => {
  test('clone array schema', ({ assert }) => {
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      type: 'array',
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
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )
    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      type: 'array',
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
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      type: 'array',
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
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      type: 'array',
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

  test('clone and apply rules', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .minLength(10)

    const schema1 = schema.clone().maxLength(20)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://3',
        },
      ],
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
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://3',
        },
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://4',
        },
      ],
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

  test('clone and define parser', ({ assert }) => {
    const schema = vine.array(
      vine.object({
        username: vine.string(),
        password: vine.string(),
      })
    )

    const schema1 = schema.clone().parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [],
      parseFnId: 'ref://3',
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

  test('apply nullable modifier and clone', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .nullable()

    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
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

  test('apply optional modifier and clone', ({ assert }) => {
    const schema = vine
      .array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .optional()

    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
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
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
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
})

test.group('VineArray | applying rules', () => {
  test('apply minLength rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).minLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = minLengthRule({ min: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('apply maxLength rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).maxLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = maxLengthRule({ max: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('apply fixedLength rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).fixedLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = fixedLengthRule({ size: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('apply notEmpty rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).notEmpty()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = notEmptyRule()
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('apply distinct rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).distinct()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = distinctRule({ fields: undefined })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('apply compact rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.array(vine.string()).compact()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = compactRule()
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })

  test('register rule via rule builder', ({ assert }) => {
    const refs = refsBuilder()

    class LengthAwareValidator implements RuleBuilder {
      [VALIDATION]() {
        return minLengthRule({ min: 2 })
      }
    }

    const schema = vine.array(vine.string()).use(new LengthAwareValidator())

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'array',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
      parseFnId: undefined,
      each: {
        type: 'literal',
        fieldName: '*',
        propertyName: '*',
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
    })

    const minLength = minLengthRule({ min: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: minLength.rule.validator,
      options: minLength.options,
    })
  })
})
