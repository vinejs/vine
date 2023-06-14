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
import { RuleBuilder } from '../../../src/types.js'
import { createRule } from '../../../src/vine/create_rule.js'
import { IS_OF_TYPE, PARSE, VALIDATION } from '../../../src/symbols.js'
import {
  inRule,
  urlRule,
  emailRule,
  trimRule,
  alphaRule,
  notInRule,
  regexRule,
  sameAsRule,
  endsWithRule,
  notSameAsRule,
  ipAddressRule,
  confirmedRule,
  activeUrlRule,
  maxLengthRule,
  minLengthRule,
  startsWithRule,
  fixedLengthRule,
  alphaNumericRule,
  normalizeEmailRule,
  creditCardRule,
  passportRule,
  postalCodeRule,
  uuidRule,
  asciiRule,
  ibanRule,
  jwtRule,
  coordinatesRule,
  toUpperCaseRule,
  toLowerCaseRule,
  toCamelCaseRule,
  escapeRule,
  normalizeUrlRule,
  mobileRule,
} from '../../../src/schema/string/rules.js'

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

  test('check if value is an object using IS_OF_TYPE method', ({ assert }) => {
    const schema = vine.string()

    assert.isTrue(schema[IS_OF_TYPE](''))
    assert.isFalse(schema[IS_OF_TYPE]({}))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE]([]))
    assert.isFalse(schema[IS_OF_TYPE](1))
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

  test('apply nullable modifier and clone', ({ assert }) => {
    const schema = vine.string().nullable()
    const schema1 = schema.clone().optional()

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
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
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

  test('apply optional modifier and clone', ({ assert }) => {
    const schema = vine.string().optional()
    const schema1 = schema.clone().nullable()

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
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
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

  test('apply transform modifier and clone', ({ assert }) => {
    const schema = vine.string().transform(() => {})
    const schema1 = schema.clone().nullable()

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
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'literal',
      fieldName: '*',
      propertyName: '*',
      allowNull: true,
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

test.group('VineString | applying rules', () => {
  test('register rule via rule builder', ({ assert }) => {
    const passwordRule = createRule(() => {})
    class Password implements RuleBuilder {
      [VALIDATION]() {
        return passwordRule()
      }
    }

    const refs = refsBuilder()
    const password = new Password()
    const schema = vine.string().use(password)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
        {
          implicit: false,
          isAsync: false,
          ruleFnId: 'ref://2',
        },
      ],
    })

    assert.deepEqual(refs.toJSON()['ref://2'], {
      validator: passwordRule().rule.validator,
      options: passwordRule().options,
    })
  })

  test('apply {name} rule via schema API')
    .with([
      {
        name: 'email',
        schema: vine.string().email(),
        rule: emailRule(),
      },
      {
        name: 'regex',
        schema: vine.string().regex(/^[a-zA-Z0-9]+$/),
        rule: regexRule(/^[a-zA-Z0-9]+$/),
      },
      {
        name: 'url',
        schema: vine.string().url(),
        rule: urlRule(),
      },
      {
        name: 'activeUrl',
        schema: vine.string().activeUrl(),
        rule: activeUrlRule(),
      },
      {
        name: 'alpha',
        schema: vine.string().alpha(),
        rule: alphaRule(),
      },
      {
        name: 'mobile',
        schema: vine.string().mobile(),
        rule: mobileRule(),
      },
      {
        name: 'alphaNumeric',
        schema: vine.string().alphaNumeric(),
        rule: alphaNumericRule(),
      },
      {
        name: 'maxLength',
        schema: vine.string().maxLength(10),
        rule: maxLengthRule({ max: 10 }),
      },
      {
        name: 'minLength',
        schema: vine.string().minLength(10),
        rule: minLengthRule({ min: 10 }),
      },
      {
        name: 'fixedLength',
        schema: vine.string().fixedLength(10),
        rule: fixedLengthRule({ size: 10 }),
      },
      {
        name: 'confirmed',
        schema: vine.string().confirmed(),
        rule: confirmedRule(),
      },
      {
        name: 'trim',
        schema: vine.string().trim(),
        rule: trimRule(),
      },
      {
        name: 'normalizeEmail',
        schema: vine.string().normalizeEmail(),
        rule: normalizeEmailRule(),
      },
      {
        name: 'startsWith',
        schema: vine.string().startsWith('foo'),
        rule: startsWithRule({ substring: 'foo' }),
      },
      {
        name: 'endsWith',
        schema: vine.string().endsWith('foo'),
        rule: endsWithRule({ substring: 'foo' }),
      },
      {
        name: 'sameAs',
        schema: vine.string().sameAs('password'),
        rule: sameAsRule({ otherField: 'password' }),
      },
      {
        name: 'notSameAs',
        schema: vine.string().notSameAs('password'),
        rule: notSameAsRule({ otherField: 'password' }),
      },
      {
        name: 'in',
        schema: vine.string().in(['admin']),
        rule: inRule({ choices: ['admin'] }),
      },
      {
        name: 'notIn',
        schema: vine.string().notIn(['admin']),
        rule: notInRule({ list: ['admin'] }),
      },
      {
        name: 'ipAddress',
        schema: vine.string().ipAddress(),
        rule: ipAddressRule(),
      },
      {
        name: 'ipAddress',
        schema: vine.string().ipAddress(4),
        rule: ipAddressRule({ version: 4 }),
      },
      {
        name: 'creditCard',
        schema: vine.string().creditCard(),
        rule: creditCardRule(),
      },
      {
        name: 'passport',
        schema: vine.string().passport({ countryCode: ['IN'] }),
        rule: passportRule({ countryCode: ['IN'] }),
      },
      {
        name: 'postalCode',
        schema: vine.string().postalCode({ countryCode: ['IN'] }),
        rule: postalCodeRule({ countryCode: ['IN'] }),
      },
      {
        name: 'uuid',
        schema: vine.string().uuid(),
        rule: uuidRule(),
      },
      {
        name: 'ascii',
        schema: vine.string().ascii(),
        rule: asciiRule(),
      },
      {
        name: 'iban',
        schema: vine.string().iban(),
        rule: ibanRule(),
      },
      {
        name: 'jwt',
        schema: vine.string().jwt(),
        rule: jwtRule(),
      },
      {
        name: 'coordinates',
        schema: vine.string().coordinates(),
        rule: coordinatesRule(),
      },
      {
        name: 'toUpperCase',
        schema: vine.string().toUpperCase(),
        rule: toUpperCaseRule(),
      },
      {
        name: 'toLowerCase',
        schema: vine.string().toLowerCase(),
        rule: toLowerCaseRule(),
      },
      {
        name: 'toCamelCase',
        schema: vine.string().toCamelCase(),
        rule: toCamelCaseRule(),
      },
      {
        name: 'escape',
        schema: vine.string().escape(),
        rule: escapeRule(),
      },
      {
        name: 'normalizeUrl',
        schema: vine.string().normalizeUrl(),
        rule: normalizeUrlRule(),
      },
    ])
    .run(({ assert }, { schema, rule }) => {
      const refs = refsBuilder()

      assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
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
          {
            implicit: false,
            isAsync: rule.rule.isAsync,
            ruleFnId: 'ref://2',
          },
        ],
      })

      assert.deepEqual(refs.toJSON()['ref://2'], {
        validator: rule.rule.validator,
        options: rule.options,
      })
    })
})
