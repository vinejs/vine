/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine, {
  Vine,
  VineEnum,
  VineTuple,
  VineArray,
  VineNumber,
  VineObject,
  VineRecord,
  VineString,
  VineLiteral,
  VineBoolean,
} from '../../index.js'
import { Infer } from '../../src/types.js'
import { ValidationError } from '../../src/errors/validation_error.js'

test.group('Validator | metadata', () => {
  test('pass metadata to the validation pipeline', async ({ assert }) => {
    assert.plan(2)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine.compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('define metadata types', async ({ assert }) => {
    assert.plan(2)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine.withMetaData<{ choices: string[] }>().compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('validate metadata', async ({ assert }) => {
    assert.plan(3)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine
      .withMetaData<{ choices: string[] }>((meta) => {
        assert.deepEqual(meta, { choices: ['admin', 'guest'] })
      })
      .compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('fail when metadata validation fails', async ({ assert }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine
      .withMetaData<{ choices: string[] }>(() => {
        throw new Error('Invalid metadata')
      })
      .compile(author)

    validator.validate(
      { name: 'virk', email: 'foo@bar.com', role: 'guest' },
      { meta: { choices: ['admin', 'guest'] } }
    )
  }).throws('Invalid metadata')
})

test.group('Validator | extend schema classes', () => {
  test('extend VineString class', ({ assert }) => {
    VineString.macro('notPawned' as any, function (value: string) {
      return value
    })

    assert.equal((vine.string() as any).notPawned('foo@bar.com'), 'foo@bar.com')
  })

  test('extend VineBoolean class', ({ assert }) => {
    VineBoolean.macro('isTrue' as any, function () {
      return true
    })

    assert.isTrue((vine.boolean() as any).isTrue())
  })

  test('extend VineNumber class', ({ assert }) => {
    VineNumber.macro('isPrime' as any, function () {
      return true
    })

    assert.isTrue((vine.number() as any).isPrime())
  })

  test('extend VineObject class', ({ assert }) => {
    VineObject.macro('validatesEmail' as any, function (this: VineObject<any, any, any, any>) {
      return 'email' in this.getProperties()
    })

    assert.isTrue((vine.object({ email: vine.string() }) as any).validatesEmail())
  })

  test('extend VineArray class', ({ assert }) => {
    VineArray.macro('atLeastOne' as any, function (this: VineArray<any>) {
      return true
    })

    assert.isTrue((vine.array(vine.string()) as any).atLeastOne())
  })

  test('extend VineRecord class', ({ assert }) => {
    VineRecord.macro('atLeastOne' as any, function (this: VineRecord<any>) {
      return true
    })

    assert.isTrue((vine.record(vine.string()) as any).atLeastOne())
  })

  test('extend VineTuple class', ({ assert }) => {
    VineTuple.macro('atLeastOne' as any, function (this: VineTuple<any, any, any, any>) {
      return true
    })

    assert.isTrue((vine.tuple([vine.string()]) as any).atLeastOne())
  })

  test('extend VineLiteral class', ({ assert }) => {
    VineLiteral.macro('isTruthy' as any, function (this: VineLiteral<any>) {
      return true
    })

    assert.isTrue((vine.literal(true) as any).isTruthy())
  })

  test('extend VineEnum class', ({ assert }) => {
    VineEnum.macro('hasMultipleOptions' as any, function (this: VineEnum<any>) {
      return this.getChoices().length > 0
    })

    assert.isTrue((vine.enum(['guest', 'moderator', 'admin']) as any).hasMultipleOptions())
  })

  test('extend Vine class', ({ assert }) => {
    Vine.macro('money' as any, function (this: Vine) {
      return true
    })

    assert.isTrue((vine as any).money())
  })
})

test.group('Validator | toJSON', () => {
  test('get JSON representation of the schema', async ({ assert }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine.compile(author)
    assert.snapshot(validator.toJSON()).matchInline(`
      {
        "refs": {
          "ref://1": {
            "options": undefined,
            "validator": [Function],
          },
          "ref://2": {
            "options": undefined,
            "validator": [Function],
          },
          "ref://3": {
            "options": undefined,
            "validator": [Function],
          },
          "ref://4": {
            "options": undefined,
            "validator": [Function],
          },
          "ref://5": {
            "options": {
              "choices": [Function],
            },
            "validator": [Function],
          },
        },
        "schema": {
          "schema": {
            "allowNull": false,
            "allowUnknownProperties": false,
            "bail": true,
            "fieldName": "",
            "groups": [],
            "isOptional": false,
            "parseFnId": undefined,
            "properties": [
              {
                "allowNull": false,
                "bail": true,
                "fieldName": "name",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "name",
                "type": "literal",
                "validations": [
                  {
                    "implicit": false,
                    "isAsync": false,
                    "ruleFnId": "ref://1",
                  },
                ],
              },
              {
                "allowNull": false,
                "bail": true,
                "fieldName": "email",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "email",
                "type": "literal",
                "validations": [
                  {
                    "implicit": false,
                    "isAsync": false,
                    "ruleFnId": "ref://2",
                  },
                  {
                    "implicit": false,
                    "isAsync": false,
                    "ruleFnId": "ref://3",
                  },
                ],
              },
              {
                "allowNull": false,
                "bail": true,
                "fieldName": "role",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "role",
                "type": "literal",
                "validations": [
                  {
                    "implicit": false,
                    "isAsync": false,
                    "ruleFnId": "ref://4",
                  },
                  {
                    "implicit": false,
                    "isAsync": false,
                    "ruleFnId": "ref://5",
                  },
                ],
              },
            ],
            "propertyName": "",
            "type": "object",
            "validations": [],
          },
          "type": "root",
        },
      }
    `)
  })
})

test.group('Validator | tryValidator', () => {
  test('return validation errors without throwing an exception', async ({
    assert,
    expectTypeOf,
  }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
    })

    const validator = vine.compile(author)
    const [error, result] = await validator.tryValidate({})
    assert.instanceOf(error, ValidationError)
    assert.isNull(result)

    if (error) {
      expectTypeOf(result).toMatchTypeOf(null)
      expectTypeOf(error).toMatchTypeOf<ValidationError>()
    }
    if (result) {
      expectTypeOf(error).toMatchTypeOf(null)
      expectTypeOf(result).toMatchTypeOf<Infer<typeof validator>>()
    }
  })

  test('rethrow non ValidationError errors', async () => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
    })

    const validator = vine
      .withMetaData<{ choices: string[] }>(() => {
        throw new Error('Invalid metadata')
      })
      .compile(author)

    await validator.tryValidate(
      {},
      {
        meta: {
          choices: [],
        },
      }
    )
  }).throws('Invalid metadata')

  test('return validated data', async ({ assert, expectTypeOf }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
    })

    const validator = vine.compile(author)
    const [error, result] = await validator.tryValidate({
      name: 'virk',
      email: 'foo@bar.com',
    })

    assert.isNull(error)
    assert.deepEqual(result, {
      name: 'virk',
      email: 'foo@bar.com',
    })

    if (error) {
      expectTypeOf(result).toMatchTypeOf(null)
      expectTypeOf(error).toMatchTypeOf<ValidationError>()
    }
    if (result) {
      expectTypeOf(error).toMatchTypeOf(null)
      expectTypeOf(result).toMatchTypeOf<Infer<typeof validator>>()
    }
  })
})
