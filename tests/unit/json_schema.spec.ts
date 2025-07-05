import { test } from '@japa/runner'
import vine from '../../index.js'
import { SchemaTypes } from '../../src/types.js'
import { JSONSchema7 } from 'json-schema'

enum Roles {
  ADMIN = 'admin',
  MOD = 'moderator',
}

test.group('JsonSchema', () => {
  test('vine.string().{0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['', vine.string(), { type: 'string' }],
      ['minLength(2)', vine.string().minLength(2), { type: 'string', minLength: 2 }],
      ['maxLength(8)', vine.string().maxLength(8), { type: 'string', maxLength: 8 }],
      [
        'fixedLength(4)',
        vine.string().fixedLength(4),
        { type: 'string', minLength: 4, maxLength: 4 },
      ],
      ['email()', vine.string().email(), { type: 'string', format: 'email' }],
      ['uuid()', vine.string().uuid(), { type: 'string', format: 'uuid' }],
      [
        'ulid()',
        vine.string().ulid(),
        { type: 'string', pattern: '^[0-7][0-9A-HJKMNP-TV-Z]{25}$' },
      ],
      ['alpha()', vine.string().alpha(), { type: 'string', pattern: '^[a-zA-Z]+$' }],
      [
        'alphaNumeric()',
        vine.string().alphaNumeric(),
        { type: 'string', pattern: '^[a-zA-Z0-9]+$' },
      ],
      [
        'hexcode()',
        vine.string().hexCode(),
        { type: 'string', pattern: '^#?([0-9a-f]{6}|[0-9a-f]{3}|[0-9a-f]{8})$' },
      ],
      [
        'regex(/hello[a-z]/)',
        vine.string().regex(/hello[a-z]/),
        { type: 'string', pattern: 'hello[a-z]' },
      ],
      ['ipAddress()', vine.string().ipAddress(), { type: 'string', format: 'ipv4' }],
      ['nullable()', vine.string().nullable(), { type: ['string', 'null'] }],
      [
        'meta({ description: "Hello Virk" })',
        vine.string().meta({ description: 'Hello Virk' }),
        { type: 'string', description: 'Hello Virk' },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.number().{0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['', vine.number(), { type: 'number' }],
      ['min(2)', vine.number().min(2), { type: 'number', minimum: 2 }],
      ['max(8)', vine.number().max(8), { type: 'number', maximum: 8 }],
      [
        'range(12, 36)',
        vine.number().range([12, 36]),
        { type: 'number', minimum: 12, maximum: 36 },
      ],
      ['positive()', vine.number().positive(), { type: 'number', minimum: 0 }],
      ['negative()', vine.number().negative(), { type: 'number', exclusiveMaximum: 0 }],
      ['withoutDecimals()', vine.number().withoutDecimals(), { type: 'integer' }],
      ['in([3, 1, 8])', vine.number().in([3, 1, 8]), { type: 'number', enum: [3, 1, 8] }],
      [
        'meta({ example: [1] })',
        vine.number().meta({ examples: [1] }),
        { type: 'number', examples: [1] },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.enum() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['no type', vine.enum([1, 3]), { enum: [1, 3] }],
      ['native enum', vine.enum(Roles), { enum: ['admin', 'moderator'] }],
      ['nullable', vine.enum([1, 3]).nullable(), { type: 'null', enum: [1, 3] }],
      [
        'nullable with predifined type',
        vine.enum(['foo', 'baz']).meta({ type: 'string' }).nullable(),
        { type: ['string', 'null'], enum: ['foo', 'baz'] },
      ],
      [
        'meta',
        vine.enum(Roles).meta({ default: Roles.ADMIN }),
        {
          enum: ['admin', 'moderator'],
          default: 'admin',
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.boolean() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['', vine.boolean(), { type: 'boolean' }],
      ['nullable', vine.boolean().nullable(), { type: ['boolean', 'null'] }],
      ['meta', vine.boolean().meta({ examples: [true] }), { type: 'boolean', examples: [true] }],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.any() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      [
        '',
        vine.any(),
        {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array' },
            { type: 'object' },
          ],
        },
      ],
      [
        'nullable',
        vine.any().nullable(),
        {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array' },
            { type: 'object' },
            { type: 'null' },
          ],
        },
      ],
      [
        'meta',
        vine.any().meta({ examples: ['ANYTHING'] }),
        {
          examples: ['ANYTHING'],
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array' },
            { type: 'object' },
          ],
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.record().{0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      [
        '',
        vine.record(vine.string()),
        { type: 'object', additionalProperties: { type: 'string' } },
      ],
      [
        'nullable()',
        vine.record(vine.number()).nullable(),
        { type: ['object', 'null'], additionalProperties: { type: 'number' } },
      ],
      [
        'minLength(2)',
        vine.record(vine.number()).minLength(2),
        { type: 'object', additionalProperties: { type: 'number' }, minProperties: 2 },
      ],
      [
        'maxLength(12)',
        vine.record(vine.number()).minLength(12),
        { type: 'object', additionalProperties: { type: 'number' }, minProperties: 12 },
      ],
      [
        'fixedLength(6)',
        vine.record(vine.number()).fixedLength(6),
        {
          type: 'object',
          additionalProperties: { type: 'number' },
          minProperties: 6,
          maxProperties: 6,
        },
      ],
      [
        'meta',
        vine.record(vine.number()).meta({ examples: [1, 2, 3] }),
        {
          type: 'object',
          additionalProperties: { type: 'number' },
          examples: [1, 2, 3],
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  // TODO: We might want to add `additionalProperties: false`
  test('vine.object() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['empty', vine.object({}), { type: 'object', properties: {}, required: [] }],
      [
        'properties',
        vine.object({ hello: vine.string(), world: vine.number() }),
        {
          type: 'object',
          properties: {
            hello: {
              type: 'string',
            },
            world: {
              type: 'number',
            },
          },
          required: ['hello', 'world'],
        },
      ],
      [
        'optional properties',
        vine.object({
          foo: vine.number().optional(),
          baz: vine.string(),
        }),
        {
          type: 'object',
          properties: {
            foo: {
              type: 'number',
            },
            baz: {
              type: 'string',
            },
          },
          required: ['baz'],
        },
      ],
      [
        'nullable',
        vine.object({}).nullable(),
        { type: ['object', 'null'], properties: {}, required: [] },
      ],
      [
        'meta',
        vine.object({}).meta({ description: 'Hello World!' }),
        { type: 'object', description: 'Hello World!', properties: {}, required: [] },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.array() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['', vine.array(vine.string()), { type: 'array', items: { type: 'string' } }],
      [
        'minLength(2)',
        vine.array(vine.string()).minLength(2),
        { type: 'array', items: { type: 'string' }, minItems: 2 },
      ],
      [
        'maxLength(8)',
        vine.array(vine.string()).maxLength(8),
        { type: 'array', items: { type: 'string' }, maxItems: 8 },
      ],
      [
        'fixedLength(8)',
        vine.array(vine.string()).fixedLength(8),
        { type: 'array', items: { type: 'string' }, minItems: 8, maxItems: 8 },
      ],
      [
        'notEmpty()',
        vine.array(vine.string()).notEmpty(),
        { type: 'array', items: { type: 'string' }, minItems: 1 },
      ],
      [
        'distinct()',
        vine.array(vine.string()).distinct(),
        { type: 'array', items: { type: 'string' }, uniqueItems: true },
      ],
      [
        'nullable',
        vine.array(vine.string()).nullable(),
        { type: ['array', 'null'], items: { type: 'string' } },
      ],
      [
        'meta',
        vine.array(vine.boolean()).meta({ examples: [[true, false, false]] }),
        { type: 'array', items: { type: 'boolean' }, examples: [[true, false, false]] },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })

  test('vine.tuple() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      [
        '',
        vine.tuple([vine.string(), vine.number()]),
        { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: false },
      ],
      // TODO: allowUnknownProperties()
      [
        'nullable',
        vine.tuple([vine.string()]).nullable(),
        { type: ['array', 'null'], items: [{ type: 'string' }], additionalItems: false },
      ],
      [
        'meta',
        vine.tuple([vine.boolean(), vine.number()]).meta({ description: 'A tuple' }),
        {
          type: 'array',
          items: [{ type: 'boolean' }, { type: 'number' }],
          additionalItems: false,
          description: 'A tuple',
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.compile(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
})
