import { test } from '@japa/runner'
import vine from '../../../index.js'
import Ajv from 'ajv'
import { SchemaTypes } from '../../../src/types.js'

const ajv = new Ajv()

function validate(schema: SchemaTypes, value: any) {
  const validator = ajv.compile(vine.compile(schema).toJSONSchema())
  return validator(value)
}

test.group('JsonSchema', () => {
  test('base', async ({ assert }) => {
    const validator = vine.string()

    assert.isTrue(validate(validator, 'Hello'))
    assert.isFalse(validate(validator, 5))
    assert.isFalse(validate(validator, null))
  })

  test('nullable', async ({ assert }) => {
    const validator = vine.string().nullable()
    assert.isTrue(validate(validator, 'Hello'))
    assert.isTrue(validate(validator, null))
    assert.isFalse(validate(validator, undefined))
  })

  test('minLength', async ({ assert }) => {
    const validator = vine.string().minLength(5)
    assert.isTrue(validate(validator, '12345'))
    assert.isTrue(validate(validator, '12345678'))
    assert.isFalse(validate(validator, '1234'))
  })

  test('maxLength', async ({ assert }) => {
    const validator = vine.string().maxLength(5)
    assert.isTrue(validate(validator, '1234'))
    assert.isTrue(validate(validator, '12345'))
    assert.isFalse(validate(validator, '123456'))
  })

  test('fixedLength', async ({ assert }) => {
    const validator = vine.string().fixedLength(5)
    assert.isTrue(validate(validator, '12345'))
    assert.isFalse(validate(validator, '123456'))
    assert.isFalse(validate(validator, '1234'))
  })
})
