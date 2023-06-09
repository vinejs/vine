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

test.group('Vine UnionOfTypes', () => {
  test('construct union schema', ({ assert }) => {
    const schema = vine.unionOfTypes([vine.boolean(), vine.string()])

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'union',
      fieldName: '*',
      propertyName: '*',
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://3',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://4',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: undefined,
    })
  })

  test('clone schema', ({ assert }) => {
    const schema = vine.unionOfTypes([vine.boolean(), vine.string()])
    const schema1 = schema.clone().otherwise(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'union',
      fieldName: '*',
      propertyName: '*',
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://3',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://4',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: undefined,
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'union',
      fieldName: '*',
      propertyName: '*',
      conditions: [
        {
          conditionalFnRefId: 'ref://2',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://3',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://4',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://5',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: 'ref://1',
    })
  })

  test('apply camelcase transform to propertyName', ({ assert }) => {
    const schema = vine.unionOfTypes([vine.boolean(), vine.string()])

    assert.deepEqual(schema[PARSE]('health_check', refsBuilder(), { toCamelCase: true }), {
      type: 'union',
      fieldName: 'health_check',
      propertyName: 'healthCheck',
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: 'health_check',
            isOptional: false,
            parseFnId: undefined,
            propertyName: 'healthCheck',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://2',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://3',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: 'health_check',
            isOptional: false,
            parseFnId: undefined,
            propertyName: 'healthCheck',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://4',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: undefined,
    })
  })

  test('copy otherwise callback to the cloned schema', ({ assert }) => {
    const schema = vine.unionOfTypes([vine.boolean(), vine.string()]).otherwise(() => {})
    const schema1 = schema.clone()

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'union',
      fieldName: '*',
      propertyName: '*',
      conditions: [
        {
          conditionalFnRefId: 'ref://2',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://3',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://4',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://5',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: 'ref://1',
    })
    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      type: 'union',
      fieldName: '*',
      propertyName: '*',
      conditions: [
        {
          conditionalFnRefId: 'ref://2',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://3',
              },
            ],
          },
        },
        {
          conditionalFnRefId: 'ref://4',
          schema: {
            allowNull: false,
            bail: true,
            fieldName: '*',
            isOptional: false,
            parseFnId: undefined,
            propertyName: '*',
            type: 'literal',
            validations: [
              {
                implicit: false,
                isAsync: false,
                ruleFnId: 'ref://5',
              },
            ],
          },
        },
      ],
      elseConditionalFnRefId: 'ref://1',
    })
  })
})
