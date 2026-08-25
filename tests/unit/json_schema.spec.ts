/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { type JSONSchema7 } from 'json-schema'

import vine from '../../index.js'
import { type SchemaTypes } from '../../src/types.js'
import { createRule } from '../../src/vine/create_rule.ts'
import { BOOLEAN_NEGATIVES, BOOLEAN_POSITIVES } from '../../src/vine/helpers.js'

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
      const validator = vine.create(schema)
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
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@string'])

  test('vine.enum() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['no type', vine.enum([1, 3]), { enum: [1, 3] }],
      ['native enum', vine.enum(Roles), { enum: ['admin', 'moderator'] }],
      ['nullable', vine.enum([1, 3]).nullable(), { anyOf: [{ enum: [1, 3] }, { type: 'null' }] }],
      [
        'nullable with predifined type',
        vine.enum(['foo', 'baz']).meta({ type: 'string' }).nullable(),
        { anyOf: [{ type: 'string', enum: ['foo', 'baz'] }, { type: 'null' }] },
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
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@enum'])

  test('vine.boolean() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['not strict', vine.boolean(), { enum: [...BOOLEAN_POSITIVES, ...BOOLEAN_NEGATIVES] }],
      ['strict', vine.boolean({ strict: true }), { type: 'boolean' }],
      ['strict nullable', vine.boolean({ strict: true }).nullable(), { type: ['boolean', 'null'] }],
      [
        'not strict nullable',
        vine.boolean().nullable(),
        { anyOf: [{ enum: [...BOOLEAN_POSITIVES, ...BOOLEAN_NEGATIVES] }, { type: 'null' }] },
      ],
      [
        'meta',
        vine.boolean({ strict: true }).meta({ examples: [true] }),
        { type: 'boolean', examples: [true] },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@boolean'])

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
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@any'])

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
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@record'])

  test('vine.object() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      [
        'empty',
        vine.object({}),
        { type: 'object', properties: {}, required: [], additionalProperties: false },
      ],
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
          additionalProperties: false,
        },
      ],
      [
        'allowUnknownProperties',
        vine.object({ hello: vine.string() }).allowUnknownProperties(),
        {
          type: 'object',
          properties: {
            hello: {
              type: 'string',
            },
          },
          required: ['hello'],
          additionalProperties: true,
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
          additionalProperties: false,
        },
      ],
      [
        'nullable',
        vine.object({}).nullable(),
        { type: ['object', 'null'], properties: {}, required: [], additionalProperties: false },
      ],
      [
        'meta',
        vine.object({}).meta({ description: 'Hello World!' }),
        {
          type: 'object',
          description: 'Hello World!',
          properties: {},
          required: [],
          additionalProperties: false,
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@object'])

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
        vine.array(vine.boolean({ strict: true })).meta({ examples: [[true, false, false]] }),
        { type: 'array', items: { type: 'boolean' }, examples: [[true, false, false]] },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@array'])

  test('vine.tuple() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      [
        '',
        vine.tuple([vine.string(), vine.number()]),
        {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
          minItems: 2,
          maxItems: 2,
          additionalItems: false,
        },
      ],
      // TODO: allowUnknownProperties()
      [
        'nullable',
        vine.tuple([vine.string()]).nullable(),
        {
          type: ['array', 'null'],
          items: [{ type: 'string' }],
          minItems: 1,
          maxItems: 1,
          additionalItems: false,
        },
      ],
      [
        'meta',
        vine
          .tuple([vine.boolean({ strict: true }), vine.number()])
          .meta({ description: 'A tuple' }),
        {
          type: 'array',
          items: [{ type: 'boolean' }, { type: 'number' }],
          minItems: 2,
          maxItems: 2,
          additionalItems: false,
          description: 'A tuple',
        },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@tuple'])

  test('vine.literal() - {0}')
    .with<[string, SchemaTypes, JSONSchema7][]>([
      ['string', vine.literal('literal_string'), { type: 'string', enum: ['literal_string'] }],
      ['number', vine.literal(2481), { type: 'number', enum: [2481] }],
      ['boolean', vine.literal(true), { type: 'boolean', enum: [true] }],
      [
        'nullable',
        vine.literal('str').nullable(),
        {
          anyOf: [{ type: 'string', enum: ['str'] }, { type: 'null' }],
        },
      ],
      [
        'meta',
        vine.literal(false).meta({ description: 'Always false' }),
        { type: 'boolean', enum: [false], description: 'Always false' },
      ],
    ])
    .run(({ assert }, [_, schema, expected]) => {
      const validator = vine.create(schema)
      assert.deepEqual(validator.toJSONSchema(), expected)
    })
    .tags(['@literal'])

  test('vine.union() - {0}')
    .run(({ assert }) => {
      const schema = vine.union([
        vine.union.if((value) => vine.helpers.isString(value), vine.string().email()),
        vine.union.if(
          (value) => vine.helpers.isObject(value),
          vine.object({ email: vine.string().email() })
        ),
      ])

      const validator = vine.create(schema)

      assert.deepEqual(validator.toJSONSchema(), {
        anyOf: [
          { type: 'string', format: 'email' },
          {
            type: 'object',
            properties: { email: { type: 'string', format: 'email' } },
            required: ['email'],
            additionalProperties: false,
          },
        ],
      })
    })
    .tags(['@union'])

  test('vine.unionOfTypes() - {0}')
    .run(({ assert }) => {
      const schema = vine.unionOfTypes([vine.string().email(), vine.number()])

      const validator = vine.create(schema)

      assert.deepEqual(validator.toJSONSchema(), {
        anyOf: [{ type: 'string', format: 'email' }, { type: 'number' }],
      })
    })
    .tags(['@unionOfTypes'])

  test('vine.group()')
    .run(({ assert }) => {
      const guideSchema = vine.group([
        vine.group.if((data) => vine.helpers.isTrue(data.is_hiring_guide), {
          is_hiring_guide: vine.literal(true),
          guide_id: vine.string(),
          amount: vine.number(),
        }),
        vine.group.else({
          is_hiring_guide: vine.literal(false),
        }),
      ])

      const schema = vine
        .object({
          name: vine.string(),
          group_size: vine.number(),
          phone_number: vine.string(),
        })
        .merge(guideSchema)

      const validator = vine.create(schema)

      assert.deepEqual(validator.toJSONSchema(), {
        anyOf: [
          {
            anyOf: [
              {
                type: 'object',
                properties: {
                  is_hiring_guide: { type: 'boolean', enum: [true] },
                  guide_id: { type: 'string' },
                  amount: { type: 'number' },
                },
                required: ['is_hiring_guide', 'guide_id', 'amount'],
              },
              {
                type: 'object',
                properties: {
                  is_hiring_guide: { type: 'boolean', enum: [false] },
                },
                required: ['is_hiring_guide'],
              },
            ],
          },
          {
            type: 'object',
            properties: {
              name: { type: 'string' },
              group_size: { type: 'number' },
              phone_number: { type: 'string' },
            },
            required: ['name', 'group_size', 'phone_number'],
            additionalProperties: false,
          },
        ],
      } satisfies JSONSchema7)
    })
    .tags(['@group'])

  test('allow custom rules to modify schema', ({ assert }) => {
    const rule = createRule(() => {}, {
      toJSONSchema: (schema) => {
        schema.type = 'string'
      },
    })

    assert.deepEqual(vine.number().use(rule()).toJSONSchema(), {
      type: 'string',
    })
  })
})
