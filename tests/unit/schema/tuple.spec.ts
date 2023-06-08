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

import { PARSE } from '../../../src/symbols.js'
import { Vine } from '../../../src/vine/main.js'

const vine = new Vine()

test.group('VineTuple', () => {
  test('create tuple', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([])

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [],
    })
  })

  test('define tuple elements', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply nullable modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply optional modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string(), vine.number()]).optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          fieldName: '1',
          propertyName: '1',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('allow unknown properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).allowUnknownProperties()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).bail(false)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('define parser', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: 'ref://1',
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('convert propertyName to camelCase', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).parse(() => {})

    assert.deepEqual(schema[PARSE]('user_scores', refs, { toCamelCase: true }), {
      type: 'tuple',
      fieldName: 'user_scores',
      propertyName: 'userScores',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: 'ref://1',
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })
})

test.group('VineTuple | clone', () => {
  test('clone tuple', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([])
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [],
    })
  })

  test('clone tuple with elements', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and apply nullable modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])
    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and apply optional modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string(), vine.number()])
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          fieldName: '1',
          propertyName: '1',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://3',
            },
          ],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          fieldName: '1',
          propertyName: '1',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://4',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and allow unknown properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])
    const schema1 = schema.clone().allowUnknownProperties()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and disable bail mode', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])
    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and define parser', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()])
    const schema1 = schema.clone().parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: 'ref://2',
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://3',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('allow unknown properties and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).allowUnknownProperties()
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('allow nullable modifier and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).nullable()
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('allow optional modifier and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.tuple([vine.string()]).optional()
    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://1',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'tuple',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          fieldName: '0',
          propertyName: '0',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [
            {
              implicit: false,
              isAsync: false,
              ruleFnId: 'ref://2',
            },
          ],
          parseFnId: undefined,
        },
      ],
    })
  })
})
