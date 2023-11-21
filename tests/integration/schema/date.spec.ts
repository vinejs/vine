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

test.group('VineDate', () => {
  test('fail when value is not a string formatted as date', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date(),
    })

    const data = { created_at: 'foo' }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'created_at',
        message: 'The created_at field must be a datetime value',
        rule: 'date',
      },
    ])
  })

  test('pass when value is a valid date', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date(),
    })

    const data = { created_at: '2024-10-01' }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), 1)
    assert.equal(result.created_at.getMonth() + 1, 10)
    assert.equal(result.created_at.getFullYear(), 2024)
    assert.equal(result.created_at.getMinutes(), 0)
    assert.equal(result.created_at.getHours(), 0)
  })

  test('throw fatal error when invalid value is provided to the comparison rules', async ({
    assert,
  }) => {
    const data = { created_at: '2024-10-01' }
    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().equals('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" value provided to the equals rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().after('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" value provided to the after rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().before('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" value provided to the before rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().beforeOrEqual('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" value provided to the beforeOrEqual rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().afterOrEqual('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" value provided to the afterOrEqual rule'
    )
  })
})
