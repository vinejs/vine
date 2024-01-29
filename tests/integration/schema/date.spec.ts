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
import dayjs from 'dayjs'

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

  test('pass when value is a valid timestamp', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: ['x'] }),
    })

    const data = { created_at: new Date().getTime() }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), new Date().getDate())
    assert.equal(result.created_at.getMonth(), new Date().getMonth())
    assert.equal(result.created_at.getFullYear(), new Date().getFullYear())
  })

  test('pass when value is a string representation of a timestamp', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: ['x'] }),
    })

    const data = { created_at: new Date().getTime().toString() }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), new Date().getDate())
    assert.equal(result.created_at.getMonth(), new Date().getMonth())
    assert.equal(result.created_at.getFullYear(), new Date().getFullYear())
  })

  test('do not allow timestamp when "x" format is not allowed', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date(),
    })

    const data = { created_at: new Date().getTime().toString() }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'created_at',
        message: 'The created_at field must be a datetime value',
        rule: 'date',
      },
    ])
  })

  test('allow other formats when timestamps are allowed', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: ['x', 'YYYY-MM-DD'] }),
    })

    const data = { created_at: dayjs().format('YYYY-MM-DD') }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), new Date().getDate())
    assert.equal(result.created_at.getMonth(), new Date().getMonth())
    assert.equal(result.created_at.getFullYear(), new Date().getFullYear())
  })

  test('pass format options as an object', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: { utc: true } }),
    })

    const data = { created_at: new Date().toUTCString() }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), new Date().getDate())
    assert.equal(result.created_at.getMonth(), new Date().getMonth())
    assert.equal(result.created_at.getFullYear(), new Date().getFullYear())
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
