/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import vine, { VineDate } from '../../../index.ts'
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
      'Invalid datetime value "foo" provided to the equals rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().after('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" provided to the after rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().before('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" provided to the before rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().beforeOrEqual('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" provided to the beforeOrEqual rule'
    )

    await assert.rejects(
      () =>
        vine.validate({
          schema: vine.object({
            created_at: vine.date().afterOrEqual('foo'),
          }),
          data,
        }),
      'Invalid datetime value "foo" provided to the afterOrEqual rule'
    )
  })

  test('allow ISO 8601 date', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: ['iso8601'] }),
    })

    const data = { created_at: '2018-04-04T16:00:00.000Z' }
    const result = await vine.validate({ schema, data })
    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), '4')
    assert.equal(result.created_at.getMonth(), '3')
    assert.equal(result.created_at.getFullYear(), '2018')
    assert.equal(result.created_at.getSeconds(), '00')
    assert.equal(result.created_at.getUTCHours(), '16')
    assert.equal(result.created_at.getUTCMinutes(), '00')
    assert.equal(result.created_at.toISOString(), '2018-04-04T16:00:00.000Z')
  })

  test('allow other formats alongside iso', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date({ formats: ['iso8601', 'YYYY/MM/DD'] }),
    })

    const data = { created_at: '2018/04/04' }
    const result = await vine.validate({ schema, data })

    assert.instanceOf(result.created_at, Date)
    assert.equal(result.created_at.getDate(), '4')
    assert.equal(result.created_at.getMonth(), '3')
    assert.equal(result.created_at.getFullYear(), '2018')
  })

  test('pass validation when optional date field is missing', async ({ assert }) => {
    const schema = vine.object({
      required_date: vine.date(),
      optional_date: vine.date().optional(),
    })

    const data = { required_date: '2024-06-15' }
    const result = await vine.validate({ schema, data })

    assert.isTrue(result.required_date instanceof Date)
    assert.isUndefined(result.optional_date)
  })

  test('pass validation when optional date field is provided', async ({ assert }) => {
    const schema = vine.object({
      required_date: vine.date(),
      optional_date: vine.date().optional(),
    })

    const data = {
      required_date: '2024-06-15',
      optional_date: '2024-12-25',
    }
    const result = await vine.validate({ schema, data })

    assert.isTrue(result.required_date instanceof Date)
    assert.isTrue(result.optional_date instanceof Date)
  })

  test('transform date to a custom value via global transforms', async ({ assert }) => {
    const schema = vine.object({
      created_at: vine.date().before('today'),
    })
    VineDate.transform((value) => DateTime.fromJSDate(value) as any)

    const data = { created_at: '2024-10-01' }
    const result = await vine.validate({ schema, data })
    const createdAt = result.created_at as unknown as DateTime

    assert.isTrue(DateTime.isDateTime(createdAt))
    assert.equal(createdAt.day, 1)
    assert.equal(createdAt.month, 10)
    assert.equal(createdAt.year, 2024)
    assert.equal(createdAt.minute, 0)
    assert.equal(createdAt.hour, 0)
  })
})
