import { test } from '@japa/runner'
import vine from '../../index.js'
import Ajv from 'ajv'
import { type SchemaTypes } from '../../src/types.js'
import { inspect } from 'node:util'

const ajv = new Ajv()

function validate(schema: SchemaTypes, value: any) {
  const validator = ajv.compile(vine.create(schema).toJSONSchema())
  return validator(value)
}

type Dataset = [title: string, validator: SchemaTypes, tests: [value: any, expected: boolean][]]

test.group('JsonSchema', () => {
  test('vine.any() - {0}')
    .with([
      [
        'base',
        vine.any(),
        [
          [{ HO: true }, true],
          ['hello world', true],
          [18391, true],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.any().nullable(),
        [
          ['still works', true],
          [null, true],
          [undefined, false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@any'])

  test('vine.string() - {0}')
    .with([
      [
        'base',
        vine.string(),
        [
          ['adonisjs', true],
          [28112000, false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.string().nullable(),
        [
          [null, true],
          ['still works', true],
          [undefined, false],
        ],
      ],
      [
        'minLength',
        vine.string().minLength(5),
        [
          ['12345', true],
          ['12345678', true],
          ['1234', false],
        ],
      ],
      [
        'maxLength',
        vine.string().maxLength(5),
        [
          ['1234', true],
          ['12345', true],
          ['12345678', false],
        ],
      ],
      [
        'fixedLength',
        vine.string().fixedLength(5),
        [
          ['12345', true],
          ['1234', false],
          ['12345678', false],
        ],
      ],
      [
        'email',
        vine.string().email(),
        [
          ['contact@example.org', true],
          ['test', false],
        ],
      ],
      [
        'uuid',
        vine.string().uuid(),
        [
          ['e9a85a01-d20f-4309-bcda-f5319f2cb4cc', true],
          ['test', false],
        ],
      ],
      [
        'ulid',
        vine.string().ulid(),
        [
          ['01K3MGCZG0HZ7XJQ3CEN6F46Q4', true],
          ['test', false],
        ],
      ],
      [
        'alpha',
        vine.string().alpha(),
        [
          ['HelloWorld', true],
          ['hello world', false],
          ['hello_world', false],
          ['hello-world', false],
          ['1283', false],
        ],
      ],
      [
        'alpha with options',
        vine.string().alpha({ allowDashes: true, allowSpaces: true, allowUnderscores: true }),
        [
          ['hello_world-foo baz', true],
          ['hello world 82', false],
        ],
      ],
      [
        'alphaNumeric',
        vine.string().alphaNumeric(),
        [
          ['HELLO', true],
          ['H12H', true],
          ['H_12', false],
          ['H-12', false],
          ['H 12', false],
        ],
      ],
      [
        'alphaNumeric with options',
        vine
          .string()
          .alphaNumeric({ allowDashes: true, allowSpaces: true, allowUnderscores: true }),
        [
          ['HELLO', true],
          ['H12H', true],
          ['H_12', true],
          ['H-12', true],
          ['H 12', true],
        ],
      ],
      [
        'ipv4',
        vine.string().ipAddress(),
        [
          ['10.0.0.0', true],
          ['10.0.0.0.0', false],
          ['694f:a349:210b:6dc4:f2e3:e3b6:0737:bcf9', false],
        ],
      ],
      [
        'ipv6',
        vine.string().ipAddress(6),
        [
          ['694f:a349:210b:6dc4:f2e3:e3b6:0737:bcf9', true],
          ['10.0.0.0', false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@string'])

  test('vine.number() - {0}')
    .with([
      [
        'base',
        vine.number(),
        [
          [28112000, true],
          ['12348', false],
          ['adonisjs', false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.number().nullable(),
        [
          [28112000, true],
          [null, true],
        ],
      ],
      [
        'min',
        vine.number().min(4),
        [
          [4, true],
          [4.801, true],
          [2, false],
          [-5, false],
          [12345, true],
        ],
      ],
      [
        'max',
        vine.number().max(4),
        [
          [4, true],
          [3.99, true],
          [2, true],
          [-10, true],
          [8, false],
          [12346, false],
        ],
      ],
      [
        'range',
        vine.number().range([10, 20]),
        [
          [10, true],
          [20, true],
          [15, true],
          [10.1, true],
          [2, false],
          [25, false],
        ],
      ],
      [
        'positive',
        vine.number().positive(),
        [
          [0, true],
          [100, true],
          [0.12, true],
          [-20, false],
        ],
      ],
      [
        'negative',
        vine.number().negative(),
        [
          [-100, true],
          [-0.1, true],
          [0, false],
          [0.5, false],
          [20, false],
        ],
      ],
      [
        'withoutDecimals',
        vine.number().withoutDecimals(),
        [
          [1381, true],
          [-1381, true],
          [10.5, false],
          [-10.5, false],
        ],
      ],
      [
        'in',
        vine.number().in([10, 38.2, -50]),
        [
          [10, true],
          [10.2, false],
          [38.2, true],
          [38, false],
          [-50, true],
          [50, false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@number'])

  test('vine.enum() - {0}')
    .with([
      [
        'no type',
        vine.enum([1, 'test', false]),
        [
          [1, true],
          [2, false],
          ['test', true],
          ['hello', false],
          [false, true],
          [true, false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.enum([1, 'test', false]).nullable(),
        [
          [1, true],
          ['test', true],
          [false, true],
          [null, true],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@enum'])

  test('vine.boolean() - {0}')
    .with([
      [
        'not strict',
        vine.boolean(),
        [
          [true, true],
          [false, true],
          [0, true],
          [1, true],
          ['on', true],
          [null, false],
        ],
      ],
      [
        'strict',
        vine.boolean({ strict: true }),
        [
          [true, true],
          [false, true],
          [0, false],
          [1, false],
          ['on', false],
          [null, false],
        ],
      ],
      [
        'not strict nullable',
        vine.boolean().nullable(),
        [
          [true, true],
          [false, true],
          [0, true],
          [1, true],
          ['on', true],
          [null, true],
        ],
      ],
      [
        'strict nullable',
        vine.boolean({ strict: true }).nullable(),
        [
          [true, true],
          [false, true],
          [0, false],
          [1, false],
          ['on', false],
          [null, true],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@boolean'])

  test('vine.record() - {0}')
    .with([
      [
        'base',
        vine.record(vine.string()),
        [
          [{ hello: 'world' }, true],
          [{}, true],
          [{ foo: false }, false],
          ['notarecord', false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.record(vine.string()).nullable(),
        [
          [{ hello: 'world' }, true],
          [{}, true],
          [{ foo: false }, false],
          ['notarecord', false],
          [null, true],
        ],
      ],
      [
        'minLength',
        vine.record(vine.string()).minLength(2),
        [
          [{ hello: 'world', foo: 'baz' }, true],
          [{ hell: 'world', foo: 'baz', baz: 'foo' }, true],
          [{ hello: 'world' }, false],
        ],
      ],
      [
        'maxLength',
        vine.record(vine.string()).maxLength(2),
        [
          [{ hello: 'world', foo: 'baz' }, true],
          [{ hello: 'world' }, true],
          [{}, true],
          [{ hell: 'world', foo: 'baz', baz: 'foo' }, false],
        ],
      ],
      [
        'fixedLength',
        vine.record(vine.string()).fixedLength(2),
        [
          [{ hello: 'world', foo: 'baz' }, true],
          [{ hello: 'world' }, false],
          [{}, false],
          [{ hell: 'world', foo: 'baz', baz: 'foo' }, false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${value} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@record'])

  test('vine.object() - {0}')
    .with([
      [
        'base',
        vine.object({ hello: vine.string(), foo: vine.number().optional() }),
        [
          [{ hello: 'world' }, true],
          [{ hello: 'world', foo: 8 }, true],
          [{ hello: 'world', heey: true }, false],
          [{ foo: 5 }, false],
          [false, false],
          [null, false],
        ],
      ],
      [
        'allowUnknownProperties',
        vine.object({ hello: vine.string() }).allowUnknownProperties(),
        [
          [{ hello: 'world' }, true],
          [{ hello: 'world', foo: 8 }, true],
        ],
      ],
      [
        'empty',
        vine.object({}),
        [
          [{}, true],
          [{ hello: 'world' }, false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${inspect(value)} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@object'])

  test('vine.array() - {0}')
    .with([
      [
        'base',
        vine.array(vine.string()),
        [
          [['hello', 'world'], true],
          [[], true],
          [{ 0: 'hey' }, false],
          [false, false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.array(vine.boolean()).nullable(),
        [
          [[true, false], true],
          [null, true],
          [[true, false, null], false],
        ],
      ],
      [
        'minLength',
        vine.array(vine.string()).minLength(2),
        [
          [['hello', 'world'], true],
          [['hello', 'world', 'foo'], true],
          [['hello'], false],
        ],
      ],
      [
        'maxLength',
        vine.array(vine.string()).maxLength(2),
        [
          [['hello', 'world'], true],
          [['hello'], true],
          [[], true],
          [['hello', 'world', 'foo'], false],
        ],
      ],
      [
        'fixedLength',
        vine.array(vine.string()).fixedLength(2),
        [
          [['hello', 'world'], true],
          [['hello'], false],
          [[], false],
          [['hello', 'world', 'foo'], false],
        ],
      ],
      [
        'notEmpty',
        vine.array(vine.string()).notEmpty(),
        [
          [['hello', 'world'], true],
          [[], false],
        ],
      ],
      [
        'distinct',
        vine.array(vine.string()).distinct(),
        [
          [['hello', 'world'], true],
          [['hello', 'world', 'hello'], false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${inspect(value)} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@array'])

  test('vine.tuple() - {0}')
    .with([
      [
        'base',
        vine.tuple([vine.string(), vine.number()]),
        [
          [['hello', 5], true],
          [['hello'], false],
          [[5, 'hello'], false],
          [[5, null], false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.tuple([vine.string(), vine.number()]).nullable(),
        [
          [['hello', 5], true],
          [null, true],
        ],
      ],
      [
        'empty',
        vine.tuple([]).nullable(),
        [
          [[], true],
          [[null], false],
          [['test'], false],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${inspect(value)} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@tuple'])

  test('vine.literal() - {0}')
    .with([
      [
        'base',
        vine.literal('hello'),
        [
          ['hello', true],
          ['hell', false],
          [null, false],
        ],
      ],
      [
        'nullable',
        vine.literal(1).nullable(),
        [
          [1, true],
          [true, false],
          [null, true],
        ],
      ],
    ] as Dataset[])
    .run(({ assert }, [, validator, tests]) => {
      for (const [value, expected] of tests) {
        const result = validate(validator, value)
        assert.equal(
          result,
          expected,
          `Expected ${inspect(value)} validation to be ${expected} but got ${result}`
        )
      }
    })
    .tags(['@literal'])
})
