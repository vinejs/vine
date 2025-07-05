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
    const validator = vine.tuple([vine.string(), vine.number()])

    assert.isTrue(validate(validator, ['Hey', 5]))
    assert.isFalse(validate(validator, [5, 'Hey']))
    // TODO: Handle this
    // assert.isFalse(validate(validator, []))
  })
})
