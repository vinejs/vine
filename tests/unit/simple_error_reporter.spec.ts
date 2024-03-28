/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { fieldContext } from '../../factories/main.js'
import { ValidationError } from '../../src/errors/validation_error.js'
import { SimpleErrorReporter } from '../../src/reporters/simple_error_reporter.js'

test.group('Simple error reporter', () => {
  test('collect reported errors', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const field = fieldContext.create('username', '')
    reporter.report('The username field is required', 'required', field)

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
    const field = fieldContext.create('username', '')
    reporter.report('The username field is required', 'required', field, {
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
    const field = fieldContext.create('username', '')
    reporter.report('Scores are required', 'required', {
      ...field,
      ...{
        isArrayMember: true,
        name: 0,
        wildCardPath: 'scores.*',
        getFieldPath() {
          return `scores.0`
        },
        parent: [],
      },
    })

    assert.isTrue(reporter.hasErrors)
    assert.deepEqual(reporter.errors, [
      {
        field: 'scores.0',
        message: 'Scores are required',
        index: 0,
        rule: 'required',
      },
    ])
  })

  test('convert errors to an instance of validation error', ({ assert }) => {
    const reporter = new SimpleErrorReporter()
    const field = fieldContext.create('username', '')
    reporter.report('The username field is required', 'required', field, {
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
