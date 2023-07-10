/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import vine from '../../index.js'

test.group('Validator', () => {
  test('pass metadata to the validation pipeline', async ({ assert }) => {
    assert.plan(2)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine.compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('define metadata types', async ({ assert }) => {
    assert.plan(2)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine.withMetaData<{ choices: string[] }>().compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('validate metadata', async ({ assert }) => {
    assert.plan(3)

    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine
      .withMetaData<{ choices: string[] }>((meta) => {
        assert.deepEqual(meta, { choices: ['admin', 'guest'] })
      })
      .compile(author)
    await assert.validationOutput(
      validator.validate(
        { name: 'virk', email: 'foo@bar.com', role: 'guest' },
        { meta: { choices: ['admin', 'guest'] } }
      ),
      { name: 'virk', email: 'foo@bar.com', role: 'guest' }
    )
  })

  test('fail when metadata validation fails', async ({ assert }) => {
    const author = vine.object({
      name: vine.string(),
      email: vine.string().email(),
      role: vine.string().in((field) => {
        assert.deepEqual(field.meta, { choices: ['admin', 'guest'] })
        return field.meta.choices
      }),
    })

    const validator = vine
      .withMetaData<{ choices: string[] }>(() => {
        throw new Error('Invalid metadata')
      })
      .compile(author)

    validator.validate(
      { name: 'virk', email: 'foo@bar.com', role: 'guest' },
      { meta: { choices: ['admin', 'guest'] } }
    )
  }).throws('Invalid metadata')
})
