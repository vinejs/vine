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
import { SimpleMessagesProvider } from '../../src/messages_provider/simple_messages_provider.js'

test.group('Simple messages provider | resolving messages', () => {
  test('get custom message for a rule', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        required: 'The field is required',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', context.create('username', undefined)),
      'The field is required'
    )
  })

  test('give priority to field message', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'required': 'The field is required',
        'username.required': 'Username is required',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', context.create('username', undefined)),
      'Username is required'
    )
  })

  test('use default message when no message is provided', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'username.required': 'Username is required',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', context.create('email', undefined)),
      'Enter value'
    )
  })
})

test.group('Simple messages provider | resolving fields', () => {
  test('substitue field name in custom message', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        required: 'The {{ field }} field is required',
      },
      {
        username: 'account id',
      }
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', context.create('username', undefined)),
      'The account id field is required'
    )
  })

  test('substitue field name in field message', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'required': 'The field is required',
        'username.required': 'The {{ field }} is required',
      },
      {
        username: 'account id',
      }
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', context.create('username', undefined)),
      'The account id is required'
    )
  })

  test('substitue field name in default message', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'username.required': 'Username is required',
      },
      {
        email: 'email address',
      }
    )

    assert.equal(
      provider.getMessage('Enter {{ field }}', 'required', context.create('email', undefined)),
      'Enter email address'
    )
  })
})

test.group('Simple messages provider | interpolation', () => {
  test('interpolate reported args', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        min: 'The {{ field }} field must have {{ min }} items',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'min', context.create('scores', undefined), {
        min: 11,
      }),
      'The scores field must have 11 items'
    )
  })

  test('interpolate nested args', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        min: 'The {{ field }} field must have {{ items.min }} items',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'min', context.create('scores', undefined), {
        items: {
          min: 11,
        },
      }),
      'The scores field must have 11 items'
    )
  })
})
