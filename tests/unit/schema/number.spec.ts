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
  inRule,
  maxRule,
  minRule,
  rangeRule,
  decimalRule,
  negativeRule,
  positiveRule,
  withoutDecimalsRule,
} from '../../../src/schema/number/rules.js'

const vine = new Vine()

test.group('VineNumber', () => {
  test('create number schema', ({ assert }) => {
    const schema = vine.number()
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
    const schema = vine.number().nullable()

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
    const schema = vine.number().optional()

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
    const schema = vine.number().bail(false)

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
    const schema = vine.number().bail(false).min(10).max(20)

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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://3',
        },
      ],
    })
  })

  test('apply transformer', ({ assert }) => {
    const schema = vine.number().transform(() => {})
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
    const schema = vine.number().parse(() => {})
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

  test('check if value is a number using IS_OF_TYPE method', ({ assert }) => {
    const schema = vine.number()

    assert.isTrue(schema[IS_OF_TYPE]('1'))
    assert.isTrue(schema[IS_OF_TYPE]('0'))
    assert.isTrue(schema[IS_OF_TYPE](1))
    assert.isTrue(schema[IS_OF_TYPE]('9.99'))
    assert.isFalse(schema[IS_OF_TYPE]('foo'))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE]({}))
  })
})

test.group('VineNumber | clone', () => {
  test('clone number schema', ({ assert }) => {
    const schema = vine.number()
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
    const schema = vine.number()
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
    const schema = vine.number()
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
    const schema = vine.number()
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
    const schema = vine.number().bail(false).min(10)
    const schema1 = schema.clone().max(20)

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
    const schema = vine.number()
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
    const schema = vine.number()
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

test.group('VineNumber | applying rules', () => {
  test('apply min rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().min(18)

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

    const min = minRule({ min: 18 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: min.rule.validator,
      options: min.options,
    })
  })

  test('apply max rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().max(18)

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

    const max = maxRule({ max: 18 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: max.rule.validator,
      options: max.options,
    })
  })

  test('apply range rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().range([18, 60])

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

    const range = rangeRule({ min: 18, max: 60 })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: range.rule.validator,
      options: range.options,
    })
  })

  test('apply positive rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().positive()

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

    const positive = positiveRule()
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: positive.rule.validator,
      options: positive.options,
    })
  })

  test('apply negative rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().negative()

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

    const negative = negativeRule()
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: negative.rule.validator,
      options: negative.options,
    })
  })

  test('apply decimal rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().decimal([0, 2])

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

    const decimal = decimalRule({ range: [0, 2] })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: decimal.rule.validator,
      options: decimal.options,
    })
  })

  test('apply decimal rule with fixed value', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().decimal(2)

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

    const decimal = decimalRule({ range: [2] })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: decimal.rule.validator,
      options: decimal.options,
    })
  })

  test('apply withoutDecimals rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().withoutDecimals()

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

    const withoutDecimals = withoutDecimalsRule()
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: withoutDecimals.rule.validator,
      options: withoutDecimals.options,
    })
  })

  test('apply in rule', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.number().in([1, 2, 3])

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

    const inArrayRule = inRule({ values: [1, 2, 3] })
    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: inArrayRule.rule.validator,
      options: inArrayRule.options,
    })
  })
})
