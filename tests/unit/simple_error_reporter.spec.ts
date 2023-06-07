/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { context } from '../../factories/main.js'
import { ValidationError } from '../../src/errors/validation_error.js'
import { SimpleErrorReporter } from '../../src/reporters/simple_error_reporter.js'

test.group('Simple error reporter', () => {
  test('collect reported errors', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const ctx = context.create('username', '')
    reporter.report('The username field is required', 'required', ctx)

    assert.isTrue(reporter.hasErrors)
    assert.deepEqual(reporter.errors, [
      {
        field: 'username',
        message: 'The username field is required',
        rule: 'required',
      },
    ])
  })

  test('collect error meta data', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const ctx = context.create('username', '')
    reporter.report('The username field is required', 'required', ctx, {
      requiredWhen: {
        missing: 'email',
      },
    })

    assert.isTrue(reporter.hasErrors)
    assert.deepEqual(reporter.errors, [
      {
        field: 'username',
        message: 'The username field is required',
        rule: 'required',
        meta: {
          requiredWhen: {
            missing: 'email',
          },
        },
      },
    ])
  })

  test('report array index when field is an array member', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const ctx = context.create('username', '')
    reporter.report('Scores are required', 'required', {
      ...ctx,
      ...{
        isArrayMember: true,
        fieldName: 0,
        wildCardPath: 'scores.*',
        parent: [],
      },
    })

    assert.isTrue(reporter.hasErrors)
    assert.deepEqual(reporter.errors, [
      {
        field: 'scores.*',
        message: 'Scores are required',
        index: 0,
        rule: 'required',
      },
    ])
  })

  test('convert errors to an instance of validation error', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const ctx = context.create('username', '')
    reporter.report('The username field is required', 'required', ctx, {
      requiredWhen: {
        missing: 'email',
      },
    })

    const error = reporter.createError()
    assert.isTrue(reporter.hasErrors)
    assert.instanceOf(error, ValidationError)
    assert.deepEqual(error.messages, [
      {
        field: 'username',
        message: 'The username field is required',
        rule: 'required',
        meta: {
          requiredWhen: {
            missing: 'email',
          },
        },
      },
    ])
  })
})
