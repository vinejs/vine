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
      provider.getMessage('Enter value', 'required', fieldContext.create('username', undefined)),
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
      provider.getMessage('Enter value', 'required', fieldContext.create('username', undefined)),
      'Username is required'
    )
  })

  test('give priority to wildcard path message', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'required': 'The field is required',
        'users.*.username.required': 'Username is required',
      },
      {}
    )

    const ctx = fieldContext.create('username', undefined)
    ctx.wildCardPath = 'users.*.username'
    assert.equal(provider.getMessage('Enter value', 'required', ctx), 'Username is required')
  })

  test('use default message when no message is provided', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        'username.required': 'Username is required',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'required', fieldContext.create('email', undefined)),
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
      provider.getMessage('Enter value', 'required', fieldContext.create('username', undefined)),
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
      provider.getMessage('Enter value', 'required', fieldContext.create('username', undefined)),
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
      provider.getMessage('Enter {{ field }}', 'required', fieldContext.create('email', undefined)),
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
      provider.getMessage('Enter value', 'min', fieldContext.create('scores', undefined), {
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
      provider.getMessage('Enter value', 'min', fieldContext.create('scores', undefined), {
        items: {
          min: 11,
        },
      }),
      'The scores field must have 11 items'
    )
  })

  test('replace missing values with undefined', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        min: 'The {{ field }} field must have {{ items.min }} items',
      },
      {}
    )

    assert.equal(
      provider.getMessage('Enter value', 'min', fieldContext.create('scores', undefined), {}),
      'The scores field must have undefined items'
    )
  })
})

test.group('Simple messages provider', () => {
  test('serialize to json', ({ assert }) => {
    const provider = new SimpleMessagesProvider(
      {
        required: 'The {{ field }} field is required',
        string: 'The value of {{ field }} field must be a string',
        email: 'The value is not a valid email address',
      },
      {
        first_name: 'first name',
        last_name: 'last name',
      }
    )

    assert.deepEqual(provider.toJSON(), {
      messages: {
        required: 'The {{ field }} field is required',
        string: 'The value of {{ field }} field must be a string',
        email: 'The value is not a valid email address',
      },
      fields: {
        first_name: 'first name',
        last_name: 'last name',
      },
    })
  })
})
