/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dayjs from 'dayjs'
import { test } from '@japa/runner'
import { validator } from '../../../factories/main.js'
import {
  dateRule,
  afterRule,
  beforeRule,
  sameAsRule,
  equalsRule,
  weekendRule,
  weekdayRule,
  notSameAsRule,
  afterFieldRule,
  beforeFieldRule,
  afterOrEqualRule,
  beforeOrEqualRule,
  afterOrSameAsRule,
  beforeOrSameAsRule,
} from '../../../src/schema/date/rules.js'

test.group('Date | date', () => {
  test('report when value is not a number or a string', () => {
    const date = dateRule({})
    const validated = validator.execute(date, {})

    validated.assertError('The dummy field must be a datetime value')
  })

  test('report when value is an invalid datetime string', () => {
    const date = dateRule({})
    const validated = validator.execute(date, '2020-32-32')

    validated.assertError('The dummy field must be a datetime value')
  })

  test('report when value is an invalid datetime string as per the expected format', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const validated = validator.execute(date, '2024/01/24')

    validated.assertError('The dummy field must be a datetime value')
  })

  test('report when value is a number but expected format is a string', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const validated = validator.execute(date, dayjs().unix())

    validated.assertError('The dummy field must be a datetime value')
  })

  test('pass validation when value is a valid datetime string', ({ assert }) => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const validated = validator.execute(date, '2024-01-22')

    validated.assertSucceeded()
    const output = validated.getOutput()
    assert.instanceOf(output, Date)
  })

  test('pass validation when value matches any of the mentioned formats', ({ assert }) => {
    const date = dateRule({ formats: ['YYYY-MM-DD', 'YYYY/DD/MM'] })
    const validated = validator.execute(date, '2024-01-22')
    validated.assertSucceeded()
    const output = validated.getOutput()
    assert.instanceOf(output, Date)
    assert.equal(dayjs(output).format('YYYY-MM-DD'), '2024-01-22')

    const validated1 = validator.execute(date, '2024/22/01')
    validated1.assertSucceeded()
    const output1 = validated.getOutput()
    assert.instanceOf(output1, Date)
    assert.equal(dayjs(output1).format('YYYY-MM-DD'), '2024-01-22')
  })

  test('validate time', ({ assert }) => {
    const date = dateRule({ formats: ['HH:mm:ss'] })
    const validated = validator.execute(date, '10:12:32')

    validated.assertSucceeded()
    const output = validated.getOutput()
    assert.instanceOf(output, Date)
  })
})

test.group('Date | equals', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const equals = equalsRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, equals], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const equals = equalsRule({ expectedValue: '2024-01-22' })
    const validated = validator.bail(false).execute([date, equals], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when year is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, equals], '2023-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date equal to 2024-01-22')
  })

  test('report error when month is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, equals], '2024-12-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date equal to 2024-01-22')
  })

  test('report error when day is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, equals], '2024-01-01')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date equal to 2024-01-22')
  })

  test('with month comparison pass when day is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({ expectedValue: '2024-01-22', compare: 'month' })
    const validated = validator.execute([date, equals], '2024-01-01')

    validated.assertSucceeded()
  })

  test('use custom format for expected value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({ expectedValue: '2024/24/01', format: 'YYYY/DD/MM' })
    const validated = validator.execute([date, equals], '2024-01-24')

    validated.assertSucceeded()
  })

  test('compute comparison value from a callback', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const equals = equalsRule({
      expectedValue: () => '2024/24/01',
      compare: 'year',
      format: 'YYYY/DD/MM',
    })
    const validated = validator.execute([date, equals], '2024-10-10')

    validated.assertSucceeded()
  })
})

test.group('Date | after', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const after = afterRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, after], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const after = afterRule({ expectedValue: '2024-01-22' })
    const validated = validator.bail(false).execute([date, after], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when year is smaller', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, after], '2022-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after 2024-01-22')
  })

  test('report error when month is smaller', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, after], '2024-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after 2024-02-22')
  })

  test('report error when day is smaller or same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, after], '2024-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after 2024-01-22')
  })

  test('pass when minutes are in the future', () => {
    const date = dateRule({})
    const after = afterRule({ expectedValue: '2024-01-22', compare: 'seconds' })
    const validated = validator.execute([date, after], '2024-01-22 12:00:00')

    validated.assertSucceeded()
  })

  test('pass when day is in the future', () => {
    const date = dateRule({})
    const after = afterRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, after], '2024-01-23')

    validated.assertSucceeded()
  })

  test('report error when day is in future but comparing for months', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: '2024-01-22', compare: 'month' })
    const validated = validator.execute([date, after], '2024-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after 2024-01-22')
  })

  test('use custom format for expected value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: '2024/24/01', format: 'YYYY/DD/MM' })
    const validated = validator.execute([date, after], '2024-01-25')

    validated.assertSucceeded()
  })

  test('compute comparison value from a callback', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({
      expectedValue: () => '2024/24/01',
      compare: 'year',
      format: 'YYYY/DD/MM',
    })
    const validated = validator.execute([date, after], '2025-01-01')

    validated.assertSucceeded()
  })

  test('use "today" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: 'today' })
    const validated = validator.execute([date, after], dayjs().add(1, 'day').format('YYYY-MM-DD'))
    validated.assertSucceeded()

    const validated1 = validator.execute([date, after], dayjs().format('YYYY-MM-DD'))
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date after today')
  })

  test('use "tomorrow" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const after = afterRule({ expectedValue: 'tomorrow' })
    const validated = validator.execute([date, after], dayjs().add(2, 'day').format('YYYY-MM-DD'))
    validated.assertSucceeded()

    const validated1 = validator.execute([date, after], dayjs().add(1, 'day').format('YYYY-MM-DD'))
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date after tomorrow')
  })
})

test.group('Date | afterOrEqual', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, afterOrEqual], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.bail(false).execute([date, afterOrEqual], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when year is smaller', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, afterOrEqual], '2022-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or equal to 2024-01-22')
  })

  test('report error when month is smaller', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or equal to 2024-02-22')
  })

  test('report error when day is smaller', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or equal to 2024-01-22')
  })

  test('pass when date is the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-22')

    validated.assertSucceeded()
  })

  test('pass when minutes are in the future', () => {
    const date = dateRule({})
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22', compare: 'seconds' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-22 12:00:00')

    validated.assertSucceeded()
  })

  test('pass when day is in the future', () => {
    const date = dateRule({})
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-23')

    validated.assertSucceeded()
  })

  test('report error when day is in future but comparing for months', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024-02-22', compare: 'month' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or equal to 2024-02-22')
  })

  test('use custom format for expected value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: '2024/24/01', format: 'YYYY/DD/MM' })
    const validated = validator.execute([date, afterOrEqual], '2024-01-25')

    validated.assertSucceeded()
  })

  test('compute comparison value from a callback', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({
      expectedValue: () => '2024/24/01',
      compare: 'year',
      format: 'YYYY/DD/MM',
    })
    const validated = validator.execute([date, afterOrEqual], '2025-01-01')

    validated.assertSucceeded()
  })

  test('use "today" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: 'today' })
    const validated = validator.execute([date, afterOrEqual], dayjs().format('YYYY-MM-DD'))
    validated.assertSucceeded()

    const validated1 = validator.execute(
      [date, afterOrEqual],
      dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    )
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date after or equal to today')
  })

  test('use "tomorrow" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrEqual = afterOrEqualRule({ expectedValue: 'tomorrow' })
    const validated = validator.execute(
      [date, afterOrEqual],
      dayjs().add(1, 'day').format('YYYY-MM-DD')
    )
    validated.assertSucceeded()

    const validated1 = validator.execute([date, afterOrEqual], dayjs().format('YYYY-MM-DD'))
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date after or equal to tomorrow')
  })
})

test.group('Date | before', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const before = beforeRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, before], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const before = beforeRule({ expectedValue: '2024-01-22' })
    const validated = validator.bail(false).execute([date, before], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when year is greater', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, before], '2025-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before 2024-02-22')
  })

  test('report error when month is greater', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, before], '2024-03-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before 2024-02-22')
  })

  test('report error when day is greater or same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, before], '2024-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before 2024-01-22')
  })

  test('pass when minutes are in the past', () => {
    const date = dateRule({})
    const before = beforeRule({ expectedValue: '2024-01-22 12:10:00', compare: 'seconds' })
    const validated = validator.execute([date, before], '2024-01-22 12:00:00')

    validated.assertSucceeded()
  })

  test('pass when day is in the past', () => {
    const date = dateRule({})
    const before = beforeRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, before], '2024-01-21')

    validated.assertSucceeded()
  })

  test('report error when day is in past but comparing for months', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: '2024-01-22', compare: 'month' })
    const validated = validator.execute([date, before], '2024-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before 2024-01-22')
  })

  test('use custom format for expected value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: '2024/24/01', format: 'YYYY/DD/MM' })
    const validated = validator.execute([date, before], '2024-01-23')

    validated.assertSucceeded()
  })

  test('compute comparison value from a callback', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({
      expectedValue: () => '2024/24/01',
      compare: 'year',
      format: 'YYYY/DD/MM',
    })
    const validated = validator.execute([date, before], '2023-01-01')

    validated.assertSucceeded()
  })

  test('use "today" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: 'today' })
    const validated = validator.execute(
      [date, before],
      dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    )
    validated.assertSucceeded()

    const validated1 = validator.execute([date, before], dayjs().format('YYYY-MM-DD'))
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date before today')
  })

  test('use "yesterday" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const before = beforeRule({ expectedValue: 'yesterday' })
    const validated = validator.execute(
      [date, before],
      dayjs().subtract(2, 'day').format('YYYY-MM-DD')
    )
    validated.assertSucceeded()

    const validated1 = validator.execute(
      [date, before],
      dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    )
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date before yesterday')
  })
})

test.group('Date | beforeOrEqual', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, beforeOrEqual], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.bail(false).execute([date, beforeOrEqual], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when year is greater', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, beforeOrEqual], '2025-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or equal to 2024-02-22')
  })

  test('report error when month is greater', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-02-22' })
    const validated = validator.execute([date, beforeOrEqual], '2024-03-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or equal to 2024-02-22')
  })

  test('report error when day is greater', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or equal to 2024-01-22')
  })

  test('pass when date is the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-22')

    validated.assertSucceeded()
  })

  test('pass when minutes are in the past', () => {
    const date = dateRule({})
    const beforeOrEqual = beforeOrEqualRule({
      expectedValue: '2024-01-22 12:10:00',
      compare: 'seconds',
    })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-22 12:00:00')

    validated.assertSucceeded()
  })

  test('pass when day is in the past', () => {
    const date = dateRule({})
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22' })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-21')

    validated.assertSucceeded()
  })

  test('report error when day is in past but comparing for months', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024-01-22', compare: 'month' })
    const validated = validator.execute([date, beforeOrEqual], '2024-02-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or equal to 2024-01-22')
  })

  test('use custom format for expected value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: '2024/24/01', format: 'YYYY/DD/MM' })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-23')

    validated.assertSucceeded()
  })

  test('compute comparison value from a callback', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({
      expectedValue: () => '2024/24/01',
      compare: 'year',
      format: 'YYYY/DD/MM',
    })
    const validated = validator.execute([date, beforeOrEqual], '2024-01-01')

    validated.assertSucceeded()
  })

  test('use "today" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: 'today' })
    const validated = validator.execute([date, beforeOrEqual], dayjs().format('YYYY-MM-DD'))
    validated.assertSucceeded()

    const validated1 = validator.execute(
      [date, beforeOrEqual],
      dayjs().add(1, 'day').format('YYYY-MM-DD')
    )
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date before or equal to today')
  })

  test('use "yesterday" keyword', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrEqual = beforeOrEqualRule({ expectedValue: 'yesterday' })
    const validated = validator.execute(
      [date, beforeOrEqual],
      dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    )
    validated.assertSucceeded()

    const validated1 = validator.execute([date, beforeOrEqual], dayjs().format('YYYY-MM-DD'))
    validated1.assertErrorsCount(1)
    validated1.assertError('The dummy field must be a date before or equal to yesterday')
  })
})

test.group('Date | sameAs', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, sameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, sameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, sameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test('report error when year is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, sameAs], '2023-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be the same')
  })

  test('report error when month is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-02-22',
        },
      })
      .execute([date, sameAs], '2023-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be the same')
  })

  test('report error when day is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, sameAs], '2023-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be the same')
  })

  test('with month comparison pass when day is not the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, sameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const sameAs = sameAsRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, sameAs], '2023/01/22')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const sameAs = sameAsRule({
      otherField: 'checkin_date',
      compare: 'month',
      format: ['YYYY-MM-DD'],
    })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, sameAs], '2023/01/22')

    validated.assertSucceeded()
  })
})

test.group('Date | notSameAs', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, notSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, notSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, notSameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test('report error when dates are the same', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, notSameAs], '2022-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be different')
  })

  test('report error when comparing month and date is different', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const notSameAs = notSameAsRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-02-22',
        },
      })
      .execute([date, notSameAs], '2023-02-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be different')
  })

  test('report error when comparing year and month is different', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const notSameAs = notSameAsRule({ otherField: 'checkin_date', compare: 'year' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-02-21',
        },
      })
      .execute([date, notSameAs], '2023-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field and checkin_date field must be different')
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const notSameAs = notSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, notSameAs], '2023/01/22')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const notSameAs = notSameAsRule({
      otherField: 'checkin_date',
      format: ['YYYY-MM-DD'],
    })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, notSameAs], '2023/01/22')

    validated.assertSucceeded()
  })
})

test.group('Date | afterField', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, afterField], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, afterField], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, afterField], '2023-01-22')

    validated.assertSucceeded()
  })

  test("report error when date is not after the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, afterField], '2022-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after checkin_date')
  })

  test("report error when month is not after the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, afterField], '2022-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after checkin_date')
  })

  test("report error when year is not after the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date', compare: 'year' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, afterField], '2022-04-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after checkin_date')
  })

  test('pass when date is in the future', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, afterField], '2023-01-22')

    validated.assertSucceeded()
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, afterField], '2023/01/22')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const afterField = afterFieldRule({ otherField: 'checkin_date', format: 'YYYY-MM-DD' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, afterField], '2023/01/22')

    validated.assertSucceeded()
  })
})

test.group('Date | afterOrSameAs', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, afterOrSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, afterOrSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, afterOrSameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test("report error when date is not after or same as the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, afterOrSameAs], '2022-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or same as checkin_date')
  })

  test("report error when month is not after or same as the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-02-22',
        },
      })
      .execute([date, afterOrSameAs], '2022-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or same as checkin_date')
  })

  test("report error when year is not after or samea as the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date', compare: 'year' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, afterOrSameAs], '2021-04-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date after or same as checkin_date')
  })

  test('pass when date is same as the other fields date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, afterOrSameAs], '2023-01-21')

    validated.assertSucceeded()
  })

  test('pass when date is after the other fields date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, afterOrSameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, afterOrSameAs], '2023/01/22')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const afterOrSameAs = afterOrSameAsRule({ otherField: 'checkin_date', format: 'YYYY-MM-DD' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, afterOrSameAs], '2023/01/22')

    validated.assertSucceeded()
  })
})

test.group('Date | beforeField', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, beforeField], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, beforeField], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, beforeField], '2023-01-22')

    validated.assertSucceeded()
  })

  test("report error when date is not before the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeField], '2022-01-22')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before checkin_date')
  })

  test("report error when month is not before the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeField], '2022-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before checkin_date')
  })

  test("report error when year is not after the before field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date', compare: 'year' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeField], '2022-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before checkin_date')
  })

  test('pass when date is in the past', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, beforeField], '2023-01-20')

    validated.assertSucceeded()
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, beforeField], '2023/01/20')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const beforeField = beforeFieldRule({ otherField: 'checkin_date', format: 'YYYY-MM-DD' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, beforeField], '2023/01/20')

    validated.assertSucceeded()
  })
})

test.group('Date | beforeOrSameAs', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.execute([date, beforeOrSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator.bail(false).execute([date, beforeOrSameAs], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when other field is not a valid date', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: 'foo',
        },
      })
      .execute([date, beforeOrSameAs], '2023-01-22')

    validated.assertSucceeded()
  })

  test("report error when date is not before or same as the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeOrSameAs], '2022-01-23')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or same as checkin_date')
  })

  test("report error when month is not before or same as the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date', compare: 'month' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeOrSameAs], '2022-02-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or same as checkin_date')
  })

  test("report error when year is not before or same the other field's value", () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date', compare: 'year' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2022-01-22',
        },
      })
      .execute([date, beforeOrSameAs], '2023-01-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a date before or same as checkin_date')
  })

  test('pass when date is in the past', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, beforeOrSameAs], '2023-01-20')

    validated.assertSucceeded()
  })

  test('pass when date is same as the other fields value', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, beforeOrSameAs], '2023-01-21')

    validated.assertSucceeded()
  })

  test('infer format from the input format', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023/01/21',
        },
      })
      .execute([date, beforeOrSameAs], '2023/01/20')

    validated.assertSucceeded()
  })

  test('define custom format for the other field', () => {
    const date = dateRule({ formats: ['YYYY/MM/DD'] })
    const beforeOrSameAs = beforeOrSameAsRule({ otherField: 'checkin_date', format: 'YYYY-MM-DD' })
    const validated = validator
      .withContext({
        data: {},
        parent: {
          checkin_date: '2023-01-21',
        },
      })
      .execute([date, beforeOrSameAs], '2023/01/20')

    validated.assertSucceeded()
  })
})

test.group('Date | weekend', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const weekend = weekendRule()
    const validated = validator.execute([date, weekend], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const weekend = weekendRule()
    const validated = validator.bail(false).execute([date, weekend], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when date is not a weekend', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekend = weekendRule()
    const validated = validator.execute([date, weekend], '2023-11-21')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field is not a weekend')
  })

  test('pass when date falls on Saturday', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekend = weekendRule()
    const validated = validator.execute([date, weekend], '2023-11-18')

    validated.assertSucceeded()
  })

  test('pass when date falls on Sunday', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekend = weekendRule()
    const validated = validator.execute([date, weekend], '2023-11-19')

    validated.assertSucceeded()
  })
})

test.group('Date | weekday', () => {
  test('skip validation when value is not a valid date', () => {
    const date = dateRule({})
    const weekday = weekdayRule()
    const validated = validator.execute([date, weekday], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('skip validation when value is not a valid date with bail mode disabled', () => {
    const date = dateRule({})
    const weekday = weekdayRule()
    const validated = validator.bail(false).execute([date, weekday], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a datetime value')
  })

  test('report error when date falls on Saturday', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekday = weekdayRule()
    const validated = validator.execute([date, weekday], '2023-11-18')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field is not a weekday')
  })

  test('report error when date falls on Sunday', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekday = weekdayRule()
    const validated = validator.execute([date, weekday], '2023-11-19')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field is not a weekday')
  })

  test('pass when date falls on a Weekday', () => {
    const date = dateRule({ formats: ['YYYY-MM-DD'] })
    const weekday = weekdayRule()
    const validated = validator.execute([date, weekday], '2023-11-21')

    validated.assertSucceeded()
  })
})
