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
import {
  maxLengthRule,
  minLengthRule,
  fixedLengthRule,
  validateKeysRule,
} from '../../../src/schema/record/rules.js'

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

  test('define parser', ({ assert }) => {
    const schema = vine
      .record(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'record',
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

  test('convert propertyName to camelCase', ({ assert }) => {
    const schema = vine
      .record(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      )
      .parse(() => {})

    assert.deepEqual(schema[PARSE]('app_users', refsBuilder(), { toCamelCase: true }), {
      type: 'record',
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

test.group('VineRecord | applying rules', () => {
  test('apply minLength rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.record(vine.string()).minLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'record',
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
    const schema = vine.record(vine.string()).maxLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'record',
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

    const maxLength = maxLengthRule({ max: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: maxLength.rule.validator,
      options: maxLength.options,
    })
  })

  test('apply fixedLength rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.record(vine.string()).fixedLength(2)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'record',
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

    const fixedLength = fixedLengthRule({ size: 2 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: fixedLength.rule.validator,
      options: fixedLength.options,
    })
  })

  test('apply validateKeys rule', ({ assert }) => {
    const refs = refsBuilder()
    const callback = () => {}
    const schema = vine.record(vine.string()).validateKeys(callback)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'record',
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

    const validateKeys = validateKeysRule(callback)
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: validateKeys.rule.validator,
      options: validateKeys.options,
    })
  })
})
