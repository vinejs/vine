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

test.group('VineString', () => {
  test('create string schema', ({ assert }) => {
    const schema = vine.string()
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('apply nullable modifier', ({ assert }) => {
    const schema = vine.string().nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('apply optional modifier', ({ assert }) => {
    const schema = vine.string().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: true,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine.string().bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: false,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('apply transformer', ({ assert }) => {
    const schema = vine.string().transform(() => {})
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      transformFnId: 'ref://2',
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })
})

test.group('VineString | clone', () => {
  test('clone string schema', ({ assert }) => {
    const schema = vine.string()
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('clone and apply nullable modifier', ({ assert }) => {
    const schema = vine.string()
    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('clone and apply optional modifier', ({ assert }) => {
    const schema = vine.string()
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: true,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('clone and disable bail mode', ({ assert }) => {
    const schema = vine.string()
    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: false,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })

  test('clone and apply transformer', ({ assert }) => {
    const schema = vine.string()
    const schema1 = schema.clone().transform(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      transformFnId: 'ref://2',
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://1',
        },
      ],
    })
  })
})
