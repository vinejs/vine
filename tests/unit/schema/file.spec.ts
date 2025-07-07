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

test.group('VineFile', () => {
  test('create file schema', ({ assert }) => {
    const schema = vine.file()
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('apply nullable modifier', ({ assert }) => {
    const schema = vine.file().nullable()
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('apply optional modifier', ({ assert }) => {
    const schema = vine.file().optional()
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: true,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine.file().bail(false)
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: false,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('apply parser', ({ assert }) => {
    const schema = vine.file().parse(() => {})
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: 'ref://2',
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('apply transformer', ({ assert }) => {
    const schema = vine.file().transform(() => {})
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      transformFnId: 'ref://2',
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('clone file schema', ({ assert }) => {
    const schema = vine.file()
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('clone and apply optional modifier', ({ assert }) => {
    const schema = vine.file()
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',

      validations: [],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: true,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',

      validations: [],
    })
  })

  test('clone and apply transformer', ({ assert }) => {
    const schema = vine.file()
    const schema1 = schema.clone().transform(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',

      validations: [],
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      transformFnId: 'ref://2',
      dataTypeValidatorFnId: 'ref://1',

      validations: [],
    })
  })

  test('clone and disable bail mode', ({ assert }) => {
    const schema = vine.file()
    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: false,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })

  test('clone and apply parser', ({ assert }) => {
    const schema = vine.file()
    const schema1 = schema.clone().parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: undefined,
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      subtype: 'file',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: 'ref://2',
      dataTypeValidatorFnId: 'ref://1',
      validations: [],
    })
  })
})
