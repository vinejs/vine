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

test.group('Vine Union', () => {
  test('construct union schema', ({ assert }) => {
    const schema = vine.union([
      vine.union.if(
        (data) => data.type === 'stripe',
        vine.object({
          type: vine.literal('stripe'),
          account_id: vine.string(),
        })
      ),
      vine.union.if(
        (data) => data.type === 'paypal',
        vine.object({
          type: vine.literal('paypal'),
          email: vine.string(),
        })
      ),
      vine.union.if(
        (data) => data.type === 'open_collective',
        vine.object({
          type: vine.literal('open_collective'),
          project_url: vine.string(),
        })
      ),
    ])

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://2',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'account_id',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'account_id',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://3',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://4',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://5',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'email',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'email',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://6',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://7',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://8',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'project_url',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'project_url',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://9',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
      ],
      elseConditionalFnRefId: undefined,
      fieldName: '*',
      propertyName: '*',
      type: 'union',
    })
  })

  test('clone schema', ({ assert }) => {
    const schema = vine.union([
      vine.union.if(
        (data) => data.type === 'stripe',
        vine.object({
          type: vine.literal('stripe'),
          account_id: vine.string(),
        })
      ),
      vine.union.if(
        (data) => data.type === 'paypal',
        vine.object({
          type: vine.literal('paypal'),
          email: vine.string(),
        })
      ),
      vine.union.if(
        (data) => data.type === 'open_collective',
        vine.object({
          type: vine.literal('open_collective'),
          project_url: vine.string(),
        })
      ),
    ])

    const schema1 = schema.clone().otherwise(() => {})

    assert.deepEqual(schema[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      conditions: [
        {
          conditionalFnRefId: 'ref://1',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://2',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'account_id',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'account_id',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://3',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://4',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://5',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'email',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'email',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://6',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://7',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://8',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'project_url',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'project_url',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://9',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
      ],
      elseConditionalFnRefId: undefined,
      fieldName: '*',
      propertyName: '*',
      type: 'union',
    })

    assert.deepEqual(schema1[PARSE]('*', refsBuilder(), { toCamelCase: false }), {
      conditions: [
        {
          conditionalFnRefId: 'ref://2',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://3',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'account_id',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'account_id',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://4',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://5',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://6',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'email',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'email',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://7',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
        {
          conditionalFnRefId: 'ref://8',
          schema: {
            allowNull: false,
            allowUnknownProperties: false,
            bail: true,
            fieldName: '*',
            groups: [],
            isOptional: false,
            parseFnId: undefined,
            properties: [
              {
                allowNull: false,
                bail: true,
                fieldName: 'type',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'type',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://9',
                  },
                ],
              },
              {
                allowNull: false,
                bail: true,
                fieldName: 'project_url',
                isOptional: false,
                parseFnId: undefined,
                propertyName: 'project_url',
                type: 'literal',
                validations: [
                  {
                    implicit: false,
                    isAsync: false,
                    ruleFnId: 'ref://10',
                  },
                ],
              },
            ],
            propertyName: '*',
            type: 'object',
            validations: [],
          },
        },
      ],
      elseConditionalFnRefId: 'ref://1',
      fieldName: '*',
      propertyName: '*',
      type: 'union',
    })
  })
})
