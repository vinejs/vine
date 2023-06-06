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

import { Vine } from '../../src/vine/main.js'
import { PARSE } from '../../src/symbols.js'

const vine = new Vine()

test.group('Schema | Root', () => {
  test('construct a flat schema', ({ assert }) => {
    const schema = vine.schema({
      username: vine.string(),
      password: vine.string(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })

  test('merge group to root schema', ({ assert }) => {
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
      .schema({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          elseConditionalFnRefId: undefined,
          conditions: [
            {
              conditionalFnRefId: 'ref://1',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://2',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })

  test('define otherwise callback', ({ assert }) => {
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
      .otherwise((_, ctx) => ctx.report('Value must be a boolean', 'union_mismatch', ctx))

    const schema = vine
      .schema({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          elseConditionalFnRefId: 'ref://1',
          conditions: [
            {
              conditionalFnRefId: 'ref://2',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://3',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'is_hiring_guide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })

  test('allow unknown properties', ({ assert }) => {
    const schema = vine
      .schema({
        username: vine.string(),
        password: vine.string(),
      })
      .allowUnknownProperties()

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine
      .schema({
        username: vine.string(),
        password: vine.string(),
      })
      .bail(false)

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })

  test('apply camelcase transform', ({ assert }) => {
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
      .schema({
        username: vine.string(),
        password: vine.string(),
      })
      .merge(hiringGuide)
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          elseConditionalFnRefId: undefined,
          conditions: [
            {
              conditionalFnRefId: 'ref://1',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'isHiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'name',
                    propertyName: 'name',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                  {
                    type: 'literal',
                    fieldName: 'price',
                    propertyName: 'price',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
                  },
                ],
              },
            },
            {
              conditionalFnRefId: 'ref://2',
              schema: {
                type: 'sub_object',
                groups: [],
                properties: [
                  {
                    type: 'literal',
                    fieldName: 'is_hiring_guide',
                    propertyName: 'isHiringGuide',
                    bail: true,
                    allowNull: false,
                    isOptional: false,
                    parseFnId: undefined,

                    validations: [],
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
          fieldName: 'username',
          propertyName: 'username',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
        {
          type: 'literal',
          fieldName: 'password',
          propertyName: 'password',
          bail: true,
          allowNull: false,
          isOptional: false,
          parseFnId: undefined,
          validations: [],
        },
      ],
    })
  })
})

test.group('Schema | Object', () => {
  test('construct a nested object schema', ({ assert }) => {
    const schema = vine.schema({
      user: vine.object({
        username: vine.string(),
        password: vine.string(),
      }),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })

  test('merge group to object schema', ({ assert }) => {
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

    const schema = vine.schema({
      user: vine
        .object({
          username: vine.string(),
          password: vine.string(),
        })
        .merge(hiringGuide),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      groups: [],
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
          parseFnId: undefined,
          groups: [
            {
              type: 'group',
              elseConditionalFnRefId: undefined,
              conditions: [
                {
                  conditionalFnRefId: 'ref://1',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'is_hiring_guide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'name',
                        propertyName: 'name',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'price',
                        propertyName: 'price',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
                {
                  conditionalFnRefId: 'ref://2',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'is_hiring_guide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          properties: [
            {
              type: 'literal',
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })

  test('define otherwise callback', ({ assert }) => {
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
      .otherwise((_, ctx) => ctx.report('Value must be a boolean', 'union_mismatch', ctx))

    const schema = vine.schema({
      user: vine
        .object({
          username: vine.string(),
          password: vine.string(),
        })
        .merge(hiringGuide),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      groups: [],
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
          parseFnId: undefined,
          groups: [
            {
              type: 'group',
              elseConditionalFnRefId: 'ref://1',
              conditions: [
                {
                  conditionalFnRefId: 'ref://2',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'is_hiring_guide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'name',
                        propertyName: 'name',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'price',
                        propertyName: 'price',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
                {
                  conditionalFnRefId: 'ref://3',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'is_hiring_guide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          properties: [
            {
              type: 'literal',
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })

  test('allow unknown properties', ({ assert }) => {
    const schema = vine.schema({
      user: vine
        .object({
          username: vine.string(),
          password: vine.string(),
        })
        .allowUnknownProperties(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          allowUnknownProperties: true,
          validations: [],
          groups: [],
          parseFnId: undefined,
          properties: [
            {
              type: 'literal',
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine.schema({
      user: vine
        .object({
          username: vine.string(),
          password: vine.string(),
        })
        .bail(false),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
              fieldName: 'username',
              propertyName: 'username',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'password',
              propertyName: 'password',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })

  test('apply camelcase transform', ({ assert }) => {
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
      .schema({
        user: vine
          .object({
            user_name: vine.string(),
            pass_word: vine.string(),
          })
          .merge(hiringGuide),
      })
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: true,
      allowNull: false,
      isOptional: false,
      allowUnknownProperties: false,
      validations: [],
      parseFnId: undefined,
      groups: [],
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
          parseFnId: undefined,
          groups: [
            {
              type: 'group',
              elseConditionalFnRefId: undefined,
              conditions: [
                {
                  conditionalFnRefId: 'ref://1',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'isHiringGuide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'name',
                        propertyName: 'name',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                      {
                        type: 'literal',
                        fieldName: 'price',
                        propertyName: 'price',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
                {
                  conditionalFnRefId: 'ref://2',
                  schema: {
                    type: 'sub_object',
                    groups: [],
                    properties: [
                      {
                        type: 'literal',
                        fieldName: 'is_hiring_guide',
                        propertyName: 'isHiringGuide',
                        bail: true,
                        allowNull: false,
                        isOptional: false,
                        parseFnId: undefined,

                        validations: [],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          properties: [
            {
              type: 'literal',
              fieldName: 'user_name',
              propertyName: 'userName',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
            {
              type: 'literal',
              fieldName: 'pass_word',
              propertyName: 'passWord',
              bail: true,
              allowNull: false,
              isOptional: false,
              parseFnId: undefined,
              validations: [],
            },
          ],
        },
      ],
    })
  })
})

test.group('Schema | Array', () => {
  test('construct array schema', ({ assert }) => {
    const schema = vine.schema({
      users: vine.array(
        vine.object({
          username: vine.string(),
          password: vine.string(),
        })
      ),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'array',
          fieldName: 'users',
          propertyName: 'users',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
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
                fieldName: 'username',
                propertyName: 'username',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,

                validations: [],
              },
              {
                type: 'literal',
                fieldName: 'password',
                propertyName: 'password',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,

                validations: [],
              },
            ],
          },
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine.schema({
      users: vine
        .array(
          vine.object({
            username: vine.string(),
            password: vine.string(),
          })
        )
        .bail(false),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'array',
          fieldName: 'users',
          propertyName: 'users',
          bail: false,
          allowNull: false,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
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
                fieldName: 'username',
                propertyName: 'username',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,

                validations: [],
              },
              {
                type: 'literal',
                fieldName: 'password',
                propertyName: 'password',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,

                validations: [],
              },
            ],
          },
        },
      ],
    })
  })

  test('allow null values', ({ assert }) => {
    const schema = vine.schema({
      users: vine
        .array(
          vine.object({
            username: vine.string(),
            password: vine.string(),
          })
        )
        .nullable(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'array',
          fieldName: 'users',
          propertyName: 'users',
          bail: true,
          allowNull: true,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
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
                fieldName: 'username',
                propertyName: 'username',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,
                validations: [],
              },
              {
                type: 'literal',
                fieldName: 'password',
                propertyName: 'password',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,
                validations: [],
              },
            ],
          },
        },
      ],
    })
  })

  test('allow optional values', ({ assert }) => {
    const schema = vine.schema({
      users: vine
        .array(
          vine.object({
            username: vine.string(),
            password: vine.string(),
          })
        )
        .optional(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'array',
          fieldName: 'users',
          propertyName: 'users',
          bail: true,
          allowNull: false,
          isOptional: true,
          validations: [],
          parseFnId: undefined,
          each: {
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
                fieldName: 'username',
                propertyName: 'username',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,
                validations: [],
              },
              {
                type: 'literal',
                fieldName: 'password',
                propertyName: 'password',
                bail: true,
                allowNull: false,
                isOptional: false,
                parseFnId: undefined,
                validations: [],
              },
            ],
          },
        },
      ],
    })
  })
})

test.group('Schema | Record', () => {
  test('construct record schema', ({ assert }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'record',
          fieldName: 'colors',
          propertyName: 'colors',
          bail: true,
          allowNull: false,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
            type: 'literal',
            fieldName: '*',
            propertyName: '*',
            bail: true,
            allowNull: false,
            isOptional: false,
            validations: [],
            parseFnId: undefined,
          },
        },
      ],
    })
  })

  test('disable bail mode', ({ assert }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()).bail(false),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'record',
          fieldName: 'colors',
          propertyName: 'colors',
          bail: false,
          allowNull: false,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
            type: 'literal',
            fieldName: '*',
            propertyName: '*',
            bail: true,
            allowNull: false,
            isOptional: false,
            validations: [],
            parseFnId: undefined,
          },
        },
      ],
    })
  })

  test('allow null values', ({ assert }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()).nullable(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'record',
          fieldName: 'colors',
          propertyName: 'colors',
          bail: true,
          allowNull: true,
          isOptional: false,
          validations: [],
          parseFnId: undefined,
          each: {
            type: 'literal',
            fieldName: '*',
            propertyName: '*',
            bail: true,
            allowNull: false,
            isOptional: false,
            validations: [],
            parseFnId: undefined,
          },
        },
      ],
    })
  })

  test('allow optional values', ({ assert }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()).optional(),
    })

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'record',
          fieldName: 'colors',
          propertyName: 'colors',
          bail: true,
          allowNull: false,
          isOptional: true,
          validations: [],
          parseFnId: undefined,
          each: {
            type: 'literal',
            fieldName: '*',
            propertyName: '*',
            bail: true,
            allowNull: false,
            isOptional: false,
            validations: [],
            parseFnId: undefined,
          },
        },
      ],
    })
  })

  test('apply camelcase transform', ({ assert }) => {
    const schema = vine
      .schema({
        color_palette: vine.record(vine.string()).optional(),
      })
      .toCamelCase()

    assert.deepEqual(schema[PARSE]('', refsBuilder(), { toCamelCase: false }), {
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
          type: 'record',
          fieldName: 'color_palette',
          propertyName: 'colorPalette',
          bail: true,
          allowNull: false,
          isOptional: true,
          validations: [],
          parseFnId: undefined,
          each: {
            type: 'literal',
            fieldName: '*',
            propertyName: '*',
            bail: true,
            allowNull: false,
            isOptional: false,
            validations: [],
            parseFnId: undefined,
          },
        },
      ],
    })
  })
})
