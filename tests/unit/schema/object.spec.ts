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

import { Vine } from '../../../src/vine/main.ts'
import { IS_OF_TYPE, PARSE } from '../../../src/symbols.ts'

const vine = new Vine()

test.group('VineObject', () => {
  test('create object', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({})

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [],
    })
  })

  test('define object properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply nullable modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply optional modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('allow unknown properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .allowUnknownProperties()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .bail(false)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('merge group', ({ assert }) => {
    const hiringGuide = vine.group([
      vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        name: vine.string(),
        price: vine.string(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('merge multiple group', ({ assert }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const monumentSchema = vine.group([
      vine.group.if((data) => data.monument === 'foo', {
        monument: vine.literal('foo'),
        available_transport: vine.enum(['bus', 'train']),
        has_free_entry: vine.literal(false),
      }),
      vine.group.if((data) => data.monument === 'bar', {
        monument: vine.literal('bar'),
        available_transport: vine.enum(['bus', 'car']),
        has_free_entry: vine.literal(true),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .merge(monumentSchema)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://2',
          conditions: [
            {
              conditionalFnRefId: 'ref://6',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://3',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'guide_name',
                    propertyName: 'guide_name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://4',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'fees',
                    propertyName: 'fees',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://8',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://7',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://9',
          conditions: [
            {
              conditionalFnRefId: 'ref://13',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://10',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'available_transport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://11',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'has_free_entry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://12',
                      },
                    ],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://17',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://14',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'available_transport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://15',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'has_free_entry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://16',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'visitor_name',
          propertyName: 'visitor_name',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('define custom otherwise callback', ({ assert }) => {
    function failOtherwise() {}

    const hiringGuide = vine
      .group([
        vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
          is_hiring_guide: vine.literal(true),
          name: vine.string(),
          price: vine.string(),
        }),
        vine.group.else({
          is_hiring_guide: vine.literal(false),
        }),
      ])
      .otherwise(failOtherwise)

    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)

    const refs = refsBuilder()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
    assert.deepEqual(refs.toJSON()['ref://3'], failOtherwise)
  })

  test('create nested object', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      user: vine.object({
        username: vine.string(),
        password: vine.string(),
      }),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://1',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('deeply apply camelcase transform', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        post_id: vine.number(),
        user: vine.object({
          user_name: vine.string(),
          pass_word: vine.string(),
        }),
      })
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('apply camelcase transform to nested object', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      post_id: vine.number(),
      user: vine
        .object({
          user_name: vine.string(),
          pass_word: vine.string(),
        })
        .toCamelCase(),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'post_id',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('apply camelcase transform to groups', ({ assert }) => {
    const hiringGuide = vine.group([
      vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        name: vine.string(),
        price: vine.string(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'isHiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'isHiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('merge camelcase transform to multiple group', ({ assert }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const monumentSchema = vine.group([
      vine.group.if((data) => data.monument === 'foo', {
        monument: vine.literal('foo'),
        available_transport: vine.enum(['bus', 'train']),
        has_free_entry: vine.literal(false),
      }),
      vine.group.if((data) => data.monument === 'bar', {
        monument: vine.literal('bar'),
        available_transport: vine.enum(['bus', 'car']),
        has_free_entry: vine.literal(true),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .merge(monumentSchema)
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://2',
          conditions: [
            {
              conditionalFnRefId: 'ref://6',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://3',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'guide_name',
                    propertyName: 'guideName',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://4',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'fees',
                    propertyName: 'fees',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://8',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://7',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://9',
          conditions: [
            {
              conditionalFnRefId: 'ref://13',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://10',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'availableTransport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://11',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'hasFreeEntry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://12',
                      },
                    ],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://17',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://14',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'availableTransport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://15',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'hasFreeEntry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://16',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'visitor_name',
          propertyName: 'visitorName',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('deeply apply camelcase transform', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        post_id: vine.number(),
        user: vine.object({
          user_name: vine.string(),
          pass_word: vine.string(),
        }),
      })
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('define parser', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({}).parse(() => {})

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: 'ref://1',
      properties: [],
    })
  })

  test('apply nullable modifier after camelcase modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        post_id: vine.number(),
        user: vine.object({
          user_name: vine.string(),
          pass_word: vine.string(),
        }),
      })
      .toCamelCase()
      .nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('apply optional modifier after camelcase modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        post_id: vine.number(),
        user: vine.object({
          user_name: vine.string(),
          pass_word: vine.string(),
        }),
      })
      .toCamelCase()
      .optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('check if value is an object using IS_OF_TYPE method', ({ assert }) => {
    const schema = vine.object({})

    assert.isTrue(schema[IS_OF_TYPE]({}))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE]([]))
    assert.isFalse(schema[IS_OF_TYPE](''))
    assert.isFalse(schema[IS_OF_TYPE](1))
  })

  test('check if value is an object after applying camelcase modifier', ({ assert }) => {
    const schema = vine.object({}).toCamelCase()

    assert.isTrue(schema[IS_OF_TYPE]({}))
    assert.isFalse(schema[IS_OF_TYPE](null))
    assert.isFalse(schema[IS_OF_TYPE](undefined))
    assert.isFalse(schema[IS_OF_TYPE]([]))
    assert.isFalse(schema[IS_OF_TYPE](''))
    assert.isFalse(schema[IS_OF_TYPE](1))
  })
})

test.group('VineObject | clone', () => {
  test('clone object', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({})
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [],
    })
  })

  test('copy properties during clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })

    const schema1 = vine.object({
      ...schema.getProperties(),
      password: vine.string(),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://3',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('cherry pick properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      id: vine.number(),
      username: vine.string(),
    })

    const schema1 = vine.object({
      ...schema.pick(['username']),
      password: vine.string(),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'id',
          propertyName: 'id',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://3',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://4',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('omit properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      id: vine.number(),
      username: vine.string(),
    })

    const schema1 = vine.object({
      ...schema.omit(['username']),
      password: vine.string(),
    })

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'id',
          propertyName: 'id',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'id',
          propertyName: 'id',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://3',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://4',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and apply nullable modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })

    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and apply optional modifier', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })
    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and allow unknown properties', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })

    const schema1 = schema.clone().allowUnknownProperties()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and disable bail mode', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine.object({
      username: vine.string(),
    })
    const schema1 = schema.clone().bail(false)

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: false,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('merge group to cloned object', ({ assert }) => {
    const hiringGuide = vine.group([
      vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        name: vine.string(),
        price: vine.string(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })
    const schema1 = schema.clone().merge(hiringGuide)

    assert.snapshot(schema[PARSE]('*', refsBuilder(), { toCamelCase: false })).matchInline(`
      {
        "allowNull": false,
        "allowUnknownProperties": false,
        "bail": true,
        "fieldName": "*",
        "groups": [],
        "isOptional": false,
        "parseFnId": undefined,
        "properties": [
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://1",
            "fieldName": "username",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "username",
            "subtype": "string",
            "type": "literal",
            "validations": [],
          },
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://2",
            "fieldName": "password",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "password",
            "subtype": "string",
            "type": "literal",
            "validations": [],
          },
        ],
        "propertyName": "*",
        "type": "object",
        "validations": [],
      }
    `)

    assert.snapshot(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false })).matchInline(`
      {
        "allowNull": false,
        "allowUnknownProperties": false,
        "bail": true,
        "fieldName": "*",
        "groups": [
          {
            "conditions": [
              {
                "conditionalFnRefId": "ref://7",
                "schema": {
                  "groups": [],
                  "properties": [
                    {
                      "allowNull": false,
                      "bail": true,
                      "fieldName": "is_hiring_guide",
                      "isOptional": false,
                      "parseFnId": undefined,
                      "propertyName": "is_hiring_guide",
                      "subtype": "literal",
                      "type": "literal",
                      "validations": [
                        {
                          "implicit": false,
                          "isAsync": false,
                          "name": "equals",
                          "ruleFnId": "ref://4",
                        },
                      ],
                    },
                    {
                      "allowNull": false,
                      "bail": true,
                      "dataTypeValidatorFnId": "ref://5",
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
                      "dataTypeValidatorFnId": "ref://6",
                      "fieldName": "price",
                      "isOptional": false,
                      "parseFnId": undefined,
                      "propertyName": "price",
                      "subtype": "string",
                      "type": "literal",
                      "validations": [],
                    },
                  ],
                  "type": "sub_object",
                },
              },
              {
                "conditionalFnRefId": "ref://9",
                "schema": {
                  "groups": [],
                  "properties": [
                    {
                      "allowNull": false,
                      "bail": true,
                      "fieldName": "is_hiring_guide",
                      "isOptional": false,
                      "parseFnId": undefined,
                      "propertyName": "is_hiring_guide",
                      "subtype": "literal",
                      "type": "literal",
                      "validations": [
                        {
                          "implicit": false,
                          "isAsync": false,
                          "name": "equals",
                          "ruleFnId": "ref://8",
                        },
                      ],
                    },
                  ],
                  "type": "sub_object",
                },
              },
            ],
            "elseConditionalFnRefId": "ref://3",
            "type": "group",
          },
        ],
        "isOptional": false,
        "parseFnId": undefined,
        "properties": [
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://1",
            "fieldName": "username",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "username",
            "subtype": "string",
            "type": "literal",
            "validations": [],
          },
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://2",
            "fieldName": "password",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "password",
            "subtype": "string",
            "type": "literal",
            "validations": [],
          },
        ],
        "propertyName": "*",
        "type": "object",
        "validations": [],
      }
    `)
  })

  test('merge groups across original and cloned objects', ({ assert }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const monumentSchema = vine.group([
      vine.group.if((data) => data.monument === 'foo', {
        monument: vine.literal('foo'),
        available_transport: vine.enum(['bus', 'train']),
        has_free_entry: vine.literal(false),
      }),
      vine.group.if((data) => data.monument === 'bar', {
        monument: vine.literal('bar'),
        available_transport: vine.enum(['bus', 'car']),
        has_free_entry: vine.literal(true),
      }),
    ])

    const schema = vine.object({
      visitor_name: vine.string(),
    })
    const schema1 = schema.clone().merge(monumentSchema)
    schema.merge(guideSchema)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://2',
          conditions: [
            {
              conditionalFnRefId: 'ref://6',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://3',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'guide_name',
                    propertyName: 'guide_name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://4',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'fees',
                    propertyName: 'fees',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://8',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'hiring_guide',
                    propertyName: 'hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://7',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'visitor_name',
          propertyName: 'visitor_name',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://2',
          conditions: [
            {
              conditionalFnRefId: 'ref://6',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://3',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'available_transport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://4',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'has_free_entry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://5',
                      },
                    ],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://10',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'monument',
                    propertyName: 'monument',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://7',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'enum',
                    fieldName: 'available_transport',
                    propertyName: 'available_transport',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'enumList',
                        ruleFnId: 'ref://8',
                      },
                    ],
                  },
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'has_free_entry',
                    propertyName: 'has_free_entry',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://9',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'visitor_name',
          propertyName: 'visitor_name',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone and deeply apply camelcase transform', ({ assert }) => {
    const schema = vine.object({
      post_id: vine.number(),
      user: vine.object({
        user_name: vine.string(),
        pass_word: vine.string(),
      }),
    })

    const schema1 = schema.clone().toCamelCase()

    assert.snapshot(schema[PARSE]('*', refsBuilder(), { toCamelCase: false })).matchInline(`
      {
        "allowNull": false,
        "allowUnknownProperties": false,
        "bail": true,
        "fieldName": "*",
        "groups": [],
        "isOptional": false,
        "parseFnId": undefined,
        "properties": [
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://1",
            "fieldName": "post_id",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "post_id",
            "subtype": "number",
            "type": "literal",
            "validations": [],
          },
          {
            "allowNull": false,
            "allowUnknownProperties": false,
            "bail": true,
            "fieldName": "user",
            "groups": [],
            "isOptional": false,
            "parseFnId": undefined,
            "properties": [
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://2",
                "fieldName": "user_name",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "user_name",
                "subtype": "string",
                "type": "literal",
                "validations": [],
              },
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://3",
                "fieldName": "pass_word",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "pass_word",
                "subtype": "string",
                "type": "literal",
                "validations": [],
              },
            ],
            "propertyName": "user",
            "type": "object",
            "validations": [],
          },
        ],
        "propertyName": "*",
        "type": "object",
        "validations": [],
      }
    `)
    assert.snapshot(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false })).matchInline(`
      {
        "allowNull": false,
        "allowUnknownProperties": false,
        "bail": true,
        "fieldName": "*",
        "groups": [],
        "isOptional": false,
        "parseFnId": undefined,
        "properties": [
          {
            "allowNull": false,
            "bail": true,
            "dataTypeValidatorFnId": "ref://1",
            "fieldName": "post_id",
            "isOptional": false,
            "parseFnId": undefined,
            "propertyName": "postId",
            "subtype": "number",
            "type": "literal",
            "validations": [],
          },
          {
            "allowNull": false,
            "allowUnknownProperties": false,
            "bail": true,
            "fieldName": "user",
            "groups": [],
            "isOptional": false,
            "parseFnId": undefined,
            "properties": [
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://2",
                "fieldName": "user_name",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "userName",
                "subtype": "string",
                "type": "literal",
                "validations": [],
              },
              {
                "allowNull": false,
                "bail": true,
                "dataTypeValidatorFnId": "ref://3",
                "fieldName": "pass_word",
                "isOptional": false,
                "parseFnId": undefined,
                "propertyName": "passWord",
                "subtype": "string",
                "type": "literal",
                "validations": [],
              },
            ],
            "propertyName": "user",
            "type": "object",
            "validations": [],
          },
        ],
        "propertyName": "*",
        "type": "object",
        "validations": [],
      }
    `)
  })

  test('re-use schema via cloning', ({ assert }) => {
    const user = vine.object({
      user_name: vine.string(),
      pass_word: vine.string(),
    })

    const schema = vine
      .object({
        post_id: vine.number(),
        user: user.clone(),
      })
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })

    assert.deepEqual(user[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'user_name',
          propertyName: 'user_name',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'pass_word',
          propertyName: 'pass_word',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('clone group', ({ assert }) => {
    function failOtherwise() {}

    const hiringGuide = vine.group([
      vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
        is_hiring_guide: vine.literal(true),
        name: vine.string(),
        price: vine.string(),
      }),
      vine.group.else({
        is_hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const schema1 = schema.clone().merge(hiringGuide.clone().otherwise(failOtherwise))
    schema.merge(hiringGuide)

    const refs = refsBuilder()
    const refs1 = refsBuilder()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs1, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.notDeepEqual(refs.toJSON()['ref://3'], refs1.toJSON()['ref://3'])
  })

  test('define otherwise callback and clone group', ({ assert }) => {
    const hiringGuide = vine
      .group([
        vine.group.if((value) => vine.helpers.isTrue(value.is_hiring_guide), {
          is_hiring_guide: vine.literal(true),
          name: vine.string(),
          price: vine.string(),
        }),
        vine.group.else({
          is_hiring_guide: vine.literal(false),
        }),
      ])
      .otherwise(() => {})

    const schema = vine.object({
      username: vine.string(),
      password: vine.string(),
    })

    const schema1 = schema.clone().merge(hiringGuide.clone())
    schema.merge(hiringGuide)

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [
        {
          type: 'group',
          elseConditionalFnRefId: 'ref://3',
          conditions: [
            {
              conditionalFnRefId: 'ref://7',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://4',
                      },
                    ],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://5',
                    validations: [],
                    parseFnId: undefined,
                  },
                  {
                    type: 'literal',
                    subtype: 'string',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    dataTypeValidatorFnId: 'ref://6',
                    validations: [],
                    parseFnId: undefined,
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://9',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    subtype: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    validations: [
                      {
                        implicit: false,
                        isAsync: false,
                        name: 'equals',
                        ruleFnId: 'ref://8',
                      },
                    ],
                    parseFnId: undefined,
                  },
                ],
              },
            },
          ],
        },
      ],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply toCamelCase transform and clone', ({ assert }) => {
    const schema = vine
      .object({
        post_id: vine.number(),
        user: vine.object({
          user_name: vine.string(),
          pass_word: vine.string(),
        }),
      })
      .toCamelCase()

    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'number',
          fieldName: 'post_id',
          propertyName: 'postId',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'user',
          propertyName: 'user',
          bail: true,
          allowNull: false,
          isOptional: false,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://2',
              validations: [],
              parseFnId: undefined,
            },
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://3',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('allow unknown properties and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .allowUnknownProperties()

    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: true,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply nullable modifier and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .nullable()

    const schema1 = schema.clone().optional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('apply optional modifier and clone', ({ assert }) => {
    const refs = refsBuilder()
    const schema = vine
      .object({
        username: vine.string(),
      })
      .optional()

    const schema1 = schema.clone().nullable()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })

    assert.deepEqual(schema1[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: true,
      isOptional: true,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('convert to all properties optional', ({ assert }) => {
    const refs = refsBuilder()

    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
        is_remember: vine.boolean(),
        optional: vine.string().optional(),
        nested: vine.object({
          prop: vine.string(),
        }),
      })
      .toOptional()

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: true,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: true,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'boolean',
          fieldName: 'is_remember',
          propertyName: 'is_remember',
          bail: true,
          allowNull: false,
          isOptional: true,
          validations: [
            {
              implicit: false,
              isAsync: false,
              name: 'boolean',
              ruleFnId: 'ref://3',
            },
          ],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'optional',
          propertyName: 'optional',
          bail: true,
          allowNull: false,
          isOptional: true,
          dataTypeValidatorFnId: 'ref://4',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'object',
          fieldName: 'nested',
          propertyName: 'nested',
          bail: true,
          allowNull: false,
          isOptional: true,
          allowUnknownProperties: false,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              subtype: 'string',
              fieldName: 'prop',
              propertyName: 'prop',
              bail: true,
              allowNull: false,
              isOptional: false,
              dataTypeValidatorFnId: 'ref://5',
              validations: [],
              parseFnId: undefined,
            },
          ],
        },
      ],
    })
  })

  test('convert to some properties optional', ({ assert }) => {
    const refs = refsBuilder()

    const schema = vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .toOptional(['username'])

    assert.deepEqual(schema[PARSE]('*', refs, { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      groups: [],
      parseFnId: undefined,
      properties: [
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: true,
          dataTypeValidatorFnId: 'ref://1',
          validations: [],
          parseFnId: undefined,
        },
        {
          type: 'literal',
          subtype: 'string',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          dataTypeValidatorFnId: 'ref://2',
          validations: [],
          parseFnId: undefined,
        },
      ],
    })
  })

  test('toOptional throws error for groups and unknown properties', () => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .toOptional()
  }).throws(
    'toOptional cannot be used on schemas that have groups or allowUnknownProperties enabled'
  )
})
