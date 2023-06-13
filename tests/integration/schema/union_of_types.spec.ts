/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine from '../../../index.js'

test.group('UnionOfTypes', () => {
  test('report error when none of the unions match', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        rule: 'unionOfTypes',
        field: 'health_check',
        message: 'Invalid value provided for health_check field',
      },
    ])
  })

  test('report error when union schema reports error', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {
      health_check: 'foo',
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        rule: 'url',
        field: 'health_check',
        message: 'The health_check field must be a valid URL',
      },
    ])
  })

  test('pass validation when data is valid as per union schema', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine.unionOfTypes([vine.boolean(), vine.string().url()]),
    })

    const data = {
      health_check: 'https://foo.com',
    }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('report error using otherwise callback', async ({ assert }) => {
    const schema = vine.object({
      health_check: vine
        .unionOfTypes([vine.boolean(), vine.string().url()])
        .otherwise((_, field) => {
          field.report('The health_check url must be a boolean or string', 'invalid_url', field)
        }),
    })

    const data = {}
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'health_check',
        message: 'The health_check url must be a boolean or string',
        rule: 'invalid_url',
      },
    ])
  })

  test('disallow duplicate types', async ({ assert }) => {
    assert.throws(
      () => vine.unionOfTypes([vine.string().email(), vine.string().url()]),
      'Cannot use duplicate schema "vine.string". "vine.unionOfTypes" needs distinct schema types only'
    )

    assert.throws(
      () => vine.unionOfTypes([vine.record(vine.string()), vine.record(vine.number())]),
      'Cannot use duplicate schema "vine.object". "vine.unionOfTypes" needs distinct schema types only'
    )
  })

  test('disallow union inside union of types', async ({ assert }) => {
    assert.throws(
      () => vine.unionOfTypes([vine.union([])]),
      'Cannot use "VineUnion". The schema type is not compatible for use with "vine.unionOfTypes"'
    )
  })
})
