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

import { Vine } from '../../../src/vine/main.js'
import { IS_OF_TYPE, PARSE } from '../../../src/symbols.js'
import {
  afterRule,
  beforeRule,
  sameAsRule,
  equalsRule,
  notSameAsRule,
  afterFieldRule,
  beforeFieldRule,
  afterOrEqualRule,
  beforeOrEqualRule,
  afterOrSameAsRule,
  beforeOrSameAsRule,
} from '../../../src/schema/date/rules.js'

const vine = new Vine()

test.group('VineDate', () => {
  test('create date schema', ({ assert }) => {
    const schema = vine.date()
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
    const schema = vine.date().nullable()

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
    const schema = vine.date().optional()

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
    const schema = vine.date().bail(false)

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

  test('apply rules', ({ assert }) => {
    const schema = vine.date().bail(false).after('today')

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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })
  })

  test('apply transformer', ({ assert }) => {
    const schema = vine.date().transform(() => {})
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

  test('apply parser', ({ assert }) => {
    const schema = vine.date().parse(() => {})
    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: false,
      isOptional: false,
      bail: true,
      parseFnId: 'ref://1',
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })
  })

  test('check if value is a date using IS_OF_TYPE method', ({ assert }) => {
    const schema = vine.date()

    assert.isTrue(schema[IS_OF_TYPE]('2024-01-22'))
    assert.isTrue(schema[IS_OF_TYPE]('2024-01-22 23:00:00'))
    assert.isFalse(schema[IS_OF_TYPE]('foo'))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE]({}))
  })
})

test.group('VineDate | clone', () => {
  test('clone date schema', ({ assert }) => {
    const schema = vine.date()
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
    const schema = vine.date()
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
    const schema = vine.date()
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
    const schema = vine.date()
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

  test('clone and apply rules', ({ assert }) => {
    const schema = vine.date().bail(false).after('today')
    const schema1 = schema.clone().afterOrEqual('today')

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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://3',
        },
      ],
    })
  })

  test('clone and apply transformer', ({ assert }) => {
    const schema = vine.date()
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

  test('clone and apply parser', ({ assert }) => {
    const schema = vine.date()
    const schema1 = schema.clone().parse(() => {})

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
      parseFnId: 'ref://1',
      validations: [
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })
  })
})

test.group('VineDate | applying rules', () => {
  test('apply equals rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().equals('2024-10-20')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const equals = equalsRule({ expectedValue: '2024-10-20' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: equals.rule.validator,
      options: equals.options,
    })
  })

  test('apply after rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().after('today')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const after = afterRule({ expectedValue: 'today' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: after.rule.validator,
      options: after.options,
    })
  })

  test('apply before rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().before('today')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const before = beforeRule({ expectedValue: 'today' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: before.rule.validator,
      options: before.options,
    })
  })

  test('apply afterOrEqual rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().afterOrEqual('2024-01-10')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-10' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: afterOrEqual.rule.validator,
      options: afterOrEqual.options,
    })
  })

  test('apply beforeOrEqual rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().beforeOrEqual('2024-01-10')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-10' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: beforeOrEqual.rule.validator,
      options: beforeOrEqual.options,
    })
  })

  test('apply sameAs rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().sameAs('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: sameAs.rule.validator,
      options: sameAs.options,
    })
  })

  test('apply notSameAs rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().notSameAs('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: notSameAs.rule.validator,
      options: notSameAs.options,
    })
  })

  test('apply afterField rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().afterField('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: afterField.rule.validator,
      options: afterField.options,
    })
  })

  test('apply afterOrSameAs rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().afterOrSameAs('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: afterOrSameAs.rule.validator,
      options: afterOrSameAs.options,
    })
  })

  test('apply beforeField rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().beforeField('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: beforeField.rule.validator,
      options: beforeField.options,
    })
  })

  test('apply beforeOrSameAs rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.date().beforeOrSameAs('checkin_date')

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: beforeOrSameAs.rule.validator,
      options: beforeOrSameAs.options,
    })
  })
})
