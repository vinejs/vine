/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Ajv from 'ajv'
import { test } from '@japa/runner'
import vine from '../../index.ts'

const ajv = new Ajv({ allErrors: true })

test.group('JSON Schema Validator | tryValidator', () => {
  test('return validation errors without throwing an exception', async ({ assert }) => {
    const validator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
    })
    const jsonSchema = validator.toJSONSchema()
    const validate = ajv.compile(jsonSchema)
    const isValid = validate({})

    assert.isFalse(isValid)
    assert.deepEqual(validate.errors, [
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: { missingProperty: 'name' },
        message: "should have required property 'name'",
      },
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: { missingProperty: 'email' },
        message: "should have required property 'email'",
      },
    ])
  })
})

test.group('JSON Schema Validator | regression', () => {
  test('validate field names with dots inside them', async ({ assert }) => {
    const validator = vine.create({
      'hub.mode': vine.literal('subscribe'),
      'hub.challenge': vine.number(),
      'hub.verify_token': vine.literal('env'),
    })
    const jsonSchema = validator.toJSONSchema()
    const validate = ajv.compile(jsonSchema)
    const isValid = validate({
      'hub.mode': 'subscribe',
      'hub.challenge': 1158201444,
      'hub.verify_token': 'env',
    })

    assert.isTrue(isValid)
  })

  test('allow object keys to be numeric', async ({ assert }) => {
    const validator = vine.create(
      vine.object({
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
    )
    const jsonSchema = validator.toJSONSchema()
    const validate = ajv.compile(jsonSchema)
    const isValid = validate({
      days_of_week: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
      },
    })

    assert.isTrue(isValid)
  })
})

test.group('JSON Schema Validator', () => {
  test('access validator schema and clone it', async ({ assert }) => {
    const createAuthorValidator = vine.create({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string(),
    })

    const updateAuthorValidator = vine.create(createAuthorValidator.schema.partial())

    // Partial schema allows empty objects
    const jsonSchema1 = updateAuthorValidator.toJSONSchema()
    const validate1 = ajv.compile(jsonSchema1)
    assert.isTrue(validate1({}))

    // Original schema requires all fields
    const jsonSchema2 = createAuthorValidator.toJSONSchema()
    const validate2 = ajv.compile(jsonSchema2)

    assert.isFalse(validate2({}))
    assert.deepEqual(validate2.errors, [
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: { missingProperty: 'name' },
        message: "should have required property 'name'",
      },
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: { missingProperty: 'email' },
        message: "should have required property 'email'",
      },
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: { missingProperty: 'role' },
        message: "should have required property 'role'",
      },
    ])
  })
})
