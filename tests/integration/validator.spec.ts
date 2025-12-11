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
  VineNativeFile,
} from '../../index.ts'
import { type Infer } from '../../src/types.ts'
import { ValidationError } from '../../src/errors/validation_error.ts'
import { type StandardSchemaV1 } from '@standard-schema/spec'

test.group('Validator | metadata', () => {
  test('pass metadata to the validation pipeline', async ({ assert }) => {
    assert.plan(2)

    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })
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

    const validator = vine.withMetaData<{ choices: string[] }>().create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })
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

    const validator = vine
      .withMetaData<{ choices: string[] }>((meta) => {
        assert.deepEqual(meta, { choices: ['admin', 'guest'] })
      })
      .create({
        name: vine.string(),
        email: vine.string().email(),
        role: vine.string().in((field) => {
          assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
          return field.meta.choices
        }),
      })
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('fail when metadata validation fails', async ({ assert }) => {
    const validator = vine
      .withMetaData<{ choices: string[] }>(() => {
        throw new Error('Invalid metadata')
      })
      .create({
        name: vine.string(),
        email: vine.string().email(),
        role: vine.string().in((field) => {
          assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
          return field.meta.choices
        }),
      })

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

  test('extend VineNativeFile class', ({ assert }) => {
    VineNativeFile.macro('isImage' as any, function (this: VineNativeFile) {
      return true
    })

    assert.isTrue((vine.nativeFile() as any).isImage())
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
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })
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
                "dataTypeValidatorFnId": "ref://1",
                "fieldName": "name",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "name",
                "subtype": "string",
                "type": "literal",
                "validations": [],
              },
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://2",
                "fieldName": "email",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "email",
                "subtype": "string",
                "type": "literal",
                "validations": [
                  {
                    "implicit": false,
                    "isAsync": false,
                    "name": "email",
                    "ruleFnId": "ref://3",
                  },
                ],
              },
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://4",
                "fieldName": "role",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "role",
                "subtype": "string",
                "type": "literal",
                "validations": [
                  {
                    "implicit": false,
                    "isAsync": false,
                    "name": "inList",
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
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
    })
    const [error, result] = await validator.tryValidate({})
    assert.instanceOf(error, ValidationError)
    assert.isNull(result)

    if (error) {
      expectTypeOf(result).toEqualTypeOf(null)
      expectTypeOf(error).toEqualTypeOf<ValidationError>()
    }
    if (result) {
      expectTypeOf(error).toEqualTypeOf(null)
      expectTypeOf(result).toEqualTypeOf<Infer<typeof validator>>()
    }
  })

  test('rethrow non ValidationError errors', async () => {
    const validator = vine
      .withMetaData<{ choices: string[] }>(() => {
        throw new Error('Invalid metadata')
      })
      .create({
        name: vine.string(),
        email: vine.string().email(),
      })

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
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
    })
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
      expectTypeOf(result).toEqualTypeOf(null)
      expectTypeOf(error).toEqualTypeOf<ValidationError>()
    }
    if (result) {
      expectTypeOf(error).toEqualTypeOf(null)
      expectTypeOf(result).toEqualTypeOf<Infer<typeof validator>>()
    }
  })
})

test.group('Validator | regression', () => {
  test('validate field names with dots inside them', async ({ assert }) => {
    const validator = vine.create({
      'hub.mode': vine.literal('subscribe'),
      'hub.challenge': vine.number(),
      'hub.verify_token': vine.literal('env'),
    })
    await assert.validationOutput(
      validator.validate({
        'hub.mode': 'subscribe',
        'hub.challenge': 1158201444,
        'hub.verify_token': 'env',
      }),
      {
        'hub.mode': 'subscribe',
        'hub.challenge': 1158201444,
        'hub.verify_token': 'env',
      }
    )
  })

  test('validate field names with hyphens inside them', async ({ assert }) => {
    const validator = vine.create(
      vine
        .object({
          'aws-address': vine.string(),
        })
        .toCamelCase()
    )
    await assert.validationOutput(
      validator.validate({
        'aws-address': 'foo',
      }),
      {
        awsAddress: 'foo',
      }
    )
  })

  test('allow object keys to be numeric', async ({ assert }) => {
    const validator = vine.create(
      vine
        .object({
          days_of_week: vine.object({
            '0': vine.string(),
            '1': vine.string(),
            '2': vine.string(),
            '3': vine.string(),
            '4': vine.string(),
            '5': vine.string(),
            '6': vine.string(),
          }),
        })
        .toCamelCase()
    )
    await assert.validationOutput(
      validator.validate({
        days_of_week: {
          0: 'Sunday',
          1: 'Monday',
          2: 'Tuesday',
          3: 'Wednesday',
          4: 'Thursday',
          5: 'Friday',
          6: 'Saturday',
        },
      }),
      {
        daysOfWeek: {
          0: 'Sunday',
          1: 'Monday',
          2: 'Tuesday',
          3: 'Wednesday',
          4: 'Thursday',
          5: 'Friday',
          6: 'Saturday',
        },
      }
    )
  })
})

test.group('Validator | standard validator', () => {
  test('return validation errors as per standard validator spec', async ({
    assert,
    expectTypeOf,
  }) => {
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
    })

    expectTypeOf<StandardSchemaV1.InferInput<typeof validator>>().toEqualTypeOf<{
      name: string
      email: string
    }>()

    expectTypeOf<StandardSchemaV1.InferOutput<typeof validator>>().toEqualTypeOf<{
      name: string
      email: string
    }>()

    const result = await validator['~standard'].validate({})
    if ('value' in result) {
      if (result.value) {
        expectTypeOf(result.value).toEqualTypeOf<Infer<typeof validator>>()
      }
    }

    if (result.issues) {
      expectTypeOf(result.issues).toEqualTypeOf<readonly StandardSchemaV1.Issue[]>()
    }

    assert.deepEqual(result.issues, [
      {
        field: 'name',
        message: 'The name field must be defined',
        path: 'name',
        rule: 'required',
      },
      {
        field: 'email',
        message: 'The email field must be defined',
        path: 'email',
        rule: 'required',
      },
    ])
  })

  test('return validated output as per standard validator spec', async ({
    assert,
    expectTypeOf,
  }) => {
    assert.plan(2)
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
    })

    expectTypeOf<StandardSchemaV1.InferInput<typeof validator>>().toEqualTypeOf<{
      name: string
      email: string
    }>()

    expectTypeOf<StandardSchemaV1.InferOutput<typeof validator>>().toEqualTypeOf<{
      name: string
      email: string
    }>()

    const result = await validator['~standard'].validate({
      name: 'virk',
      email: 'foo@bar.com',
    })

    if ('value' in result) {
      assert.deepEqual(result.value, {
        name: 'virk',
        email: 'foo@bar.com',
      })
      if (result.value) {
        expectTypeOf(result.value).toEqualTypeOf<Infer<typeof validator>>()
      }
    }

    if (result.issues) {
      expectTypeOf(result.issues).toEqualTypeOf<readonly StandardSchemaV1.Issue[]>()
    }

    assert.isUndefined(result.issues)
  })
})

test.group('Validator | bail mode disabled', () => {
  test('run all string validation rules when bail mode is disabled', async ({ assert }) => {
    const validator = vine.create({
      email: vine.string().email().minLength(5).bail(false),
    })
    await assert.validationErrors(validator.validate({ email: 'foo' }), [
      {
        field: 'email',
        message: 'The email field must be a valid email address',
        rule: 'email',
      },
      {
        field: 'email',
        message: 'The email field must have at least 5 characters',
        meta: {
          min: 5,
        },
        rule: 'minLength',
      },
    ])
  })

  test('do not run all validation rules when value is not a string', async ({ assert }) => {
    const validator = vine.create({
      email: vine.string().email().minLength(5).bail(false),
    })
    await assert.validationErrors(validator.validate({ email: 22 }), [
      {
        field: 'email',
        message: 'The email field must be a string',
        rule: 'string',
      },
    ])
  })

  test('run all number validation rules when bail mode is disabled', async ({ assert }) => {
    const validator = vine.create({
      score: vine.number().min(10).positive().bail(false),
    })
    await assert.validationErrors(validator.validate({ score: -2 }), [
      {
        field: 'score',
        message: 'The score field must be at least 10',
        meta: {
          min: 10,
        },
        rule: 'min',
      },
      {
        field: 'score',
        message: 'The score field must be positive',
        rule: 'positive',
      },
    ])
  })

  test('do not run all validation rules when value is not a number', async ({ assert }) => {
    const validator = vine.create({
      score: vine.number().min(10).positive().bail(false),
    })
    await assert.validationErrors(validator.validate({ score: 'foo' }), [
      {
        field: 'score',
        message: 'The score field must be a number',
        rule: 'number',
      },
    ])
  })

  test('run all array validation rules when bail mode is disabled', async ({ assert }) => {
    const validator = vine.create({
      scores: vine.array(vine.number()).minLength(3).distinct().bail(false),
    })
    await assert.validationErrors(validator.validate({ scores: [1, 1] }), [
      {
        field: 'scores',
        message: 'The scores field must have at least 3 items',
        meta: {
          min: 3,
        },
        rule: 'array.minLength',
      },
      {
        field: 'scores',
        message: 'The scores field has duplicate values',
        meta: {
          fields: undefined,
        },
        rule: 'distinct',
      },
    ])
  })

  test('do not run all validation rules when value is not an array', async ({ assert }) => {
    const validator = vine.create({
      scores: vine.array(vine.number()).minLength(3).distinct().bail(false),
    })
    await assert.validationErrors(validator.validate({ scores: 1 }), [
      {
        field: 'scores',
        message: 'The scores field must be an array',
        rule: 'array',
      },
    ])
  })

  test('run all record validation rules when bail mode is disabled', async ({ assert }) => {
    const validator = vine.create({
      colors: vine
        .record(vine.string())
        .minLength(4)
        .validateKeys((keys, field) => {
          if (keys.some((key) => /^[A-Za-z]+$/.test(key) === false)) {
            field.report('Invalid colors keys', 'color-keys', field)
          }
        })
        .bail(false),
    })
    await assert.validationErrors(
      validator.validate({
        colors: {
          'primary-green': '#2B9A66',
          'primary-red': '#DC3E42',
        },
      }),
      [
        {
          field: 'colors',
          message: 'The colors field must have at least 4 items',
          meta: {
            min: 4,
          },
          rule: 'record.minLength',
        },
        {
          field: 'colors',
          message: 'Invalid colors keys',
          rule: 'color-keys',
        },
      ]
    )
  })

  test('do not run all validation rules when value is not an object', async ({ assert }) => {
    const validator = vine.create({
      colors: vine
        .record(vine.string())
        .minLength(4)
        .validateKeys((keys, field) => {
          if (keys.some((key) => /^[A-Za-z]+$/.test(key) === false)) {
            field.report('Invalid colors keys', 'color-keys', field)
          }
        })
        .bail(false),
    })
    await assert.validationErrors(
      validator.validate({
        colors: [],
      }),
      [
        {
          field: 'colors',
          message: 'The colors field must be an object',
          rule: 'object',
        },
      ]
    )
  })
})

test.group('Validator', () => {
  test('access validator schema and clone it', async ({ assert }) => {
    const createAuthorValidator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const updateAuthorValidator = vine.create(createAuthorValidator.schema.partial())
    await assert.validationOutput(updateAuthorValidator.validate({}), {})
    await assert.validationErrors(createAuthorValidator.validate({}), [
      {
        field: 'name',
        message: 'The name field must be defined',
        rule: 'required',
      },
      {
        field: 'email',
        message: 'The email field must be defined',
        rule: 'required',
      },
      {
        field: 'role',
        message: 'The role field must be defined',
        rule: 'required',
      },
    ])
  })

  test('create top-level object validator', async ({ assert }) => {
    const createAuthorValidator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const updateAuthorValidator = vine.create(createAuthorValidator.schema.partial())
    await assert.validationOutput(updateAuthorValidator.validate({}), {})
    await assert.validationErrors(createAuthorValidator.validate({}), [
      {
        field: 'name',
        message: 'The name field must be defined',
        rule: 'required',
      },
      {
        field: 'email',
        message: 'The email field must be defined',
        rule: 'required',
      },
      {
        field: 'role',
        message: 'The role field must be defined',
        rule: 'required',
      },
    ])
  })
})
