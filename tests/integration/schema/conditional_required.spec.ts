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

test.group('requiredIfExists', () => {
  test('fail when value is missing but other field exists', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      password: vine.string().optional().requiredIfExists('email'),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass when value is missing but other field does not exist', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      password: vine.string().optional().requiredIfExists('email'),
    })

    const data = {}

    await assert.validationOutput(vine.validate({ schema, data }), {})
  })

  test('pass when value exists but other field does not exist', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      password: vine.string().optional().requiredIfExists('email'),
    })

    const data = {
      password: 'foo',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      password: 'foo',
    })
  })

  test('do not fail until all the other fields exists', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      password: vine.string().optional().requiredIfExists(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
    })
  })

  test('fail if all the other fields exists', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      password: vine.string().optional().requiredIfExists(['email', 'username']),
    })

    const data = {
      username: 'foo',
      email: 'foo@bar.com',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
    ])
  })
})

test.group('requiredIfAnyExists', () => {
  test('fail if value is missing and any one of the other field is present', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      password: vine.string().optional().requiredIfAnyExists(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'password',
        message: 'The password field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass if value is present', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      password: vine.string().optional().requiredIfAnyExists(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
      password: 'secret',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
      password: 'secret',
    })
  })
})

test.group('requiredIfMissing', () => {
  test('fail when value is missing and other field is missing as well', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional().requiredIfMissing('email'),
    })

    const data = {}

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'username',
        message: 'The username field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass when value is missing but other field is present', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional().requiredIfMissing('email'),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
    })
  })

  test('pass when value both the fields exist', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional().requiredIfMissing('email'),
    })

    const data = {
      email: 'foo@bar.com',
      username: 'foo',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
      username: 'foo',
    })
  })

  test('do not fail until all other fields are missing', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      githubId: vine.string().optional().requiredIfMissing(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
    })
  })

  test('fail if all the other fields are missing', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      githubId: vine.string().optional().requiredIfMissing(['email', 'username']),
    })

    const data = {}

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'githubId',
        message: 'The githubId field must be defined',
        rule: 'required',
      },
    ])
  })
})

test.group('requiredIfAnyMissing', () => {
  test('fail if value is missing and any one of the other field is missing', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      githubId: vine.string().optional().requiredIfAnyMissing(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'githubId',
        message: 'The githubId field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass if all other fields are present', async ({ assert }) => {
    const schema = vine.object({
      email: vine.string().optional(),
      username: vine.string().optional(),
      githubId: vine.string().optional().requiredIfAnyMissing(['email', 'username']),
    })

    const data = {
      email: 'foo@bar.com',
      username: 'foo',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      email: 'foo@bar.com',
      username: 'foo',
    })
  })
})

test.group('requiredWhen', () => {
  test('fail when required field is missing', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', '=', 'volleyball'),
    })

    const data = {
      game: 'volleyball',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'teamName',
        message: 'The teamName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('pass when required condition has not been met', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', '=', 'volleyball'),
    })

    const data = {
      game: 'handball',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      game: 'handball',
    })
  })

  test('pass when required field is defined', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', '=', 'volleyball'),
    })

    const data = {
      game: 'volleyball',
      teamName: 'foo',
    }

    await assert.validationOutput(vine.validate({ schema, data }), {
      game: 'volleyball',
      teamName: 'foo',
    })
  })

  test('compare using "not equal" operator', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', '!=', 'volleyball'),
    })

    const data = {
      game: 'handball',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'teamName',
        message: 'The teamName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using "in" operator', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', 'in', ['volleyball']),
    })

    const data = {
      game: 'volleyball',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'teamName',
        message: 'The teamName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using "not In" operator', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine.string().optional().requiredWhen('game', 'notIn', ['volleyball']),
    })

    const data = {
      game: 'handball',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'teamName',
        message: 'The teamName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using ">" operator', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number(),
      guardianName: vine.string().optional().requiredWhen('age', '>', 1),
    })

    const data = {
      age: 2,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'guardianName',
        message: 'The guardianName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using "<" operator', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number(),
      guardianName: vine.string().optional().requiredWhen('age', '<', 19),
    })

    const data = {
      age: 2,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'guardianName',
        message: 'The guardianName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using "<=" operator', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number(),
      guardianName: vine.string().optional().requiredWhen('age', '<=', 18),
    })

    const data = {
      age: 18,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'guardianName',
        message: 'The guardianName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using ">=" operator', async ({ assert }) => {
    const schema = vine.object({
      age: vine.number(),
      guardianName: vine.string().optional().requiredWhen('age', '>=', 1),
    })

    const data = {
      age: 1,
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'guardianName',
        message: 'The guardianName field must be defined',
        rule: 'required',
      },
    ])
  })

  test('compare using custom callback', async ({ assert }) => {
    const schema = vine.object({
      game: vine.string().optional(),
      teamName: vine
        .string()
        .optional()
        .requiredWhen((field) => {
          return field.parent.game === 'volleyball'
        }),
    })

    const data = {
      game: 'volleyball',
    }

    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'teamName',
        message: 'The teamName field must be defined',
        rule: 'required',
      },
    ])
  })
})
