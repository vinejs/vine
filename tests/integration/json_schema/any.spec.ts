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
    const validator = vine.any()

    assert.isTrue(validate(validator, ['Hey', 5]))
    assert.isTrue(validate(validator, { HO: true }))
    assert.isFalse(validate(validator, null))
  })

  test('nullable', async ({ assert }) => {
    const validator = vine.any().nullable()

    assert.isTrue(validate(validator, null))
  })
})
