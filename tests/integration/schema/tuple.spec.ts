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

test.group('VineTuple', () => {
  test('fail when value is not an array', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine.tuple([vine.number(), vine.number(), vine.number()]),
    })

    const data = {
      top_scores: 'foo',
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'top_scores',
        message: 'The top_scores field must be an array',
        rule: 'array',
      },
    ])
  })

  test('fail when tuple elements are missing', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine.tuple([vine.number(), vine.number(), vine.number()]),
    })

    const data = {
      top_scores: [1],
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'top_scores.1',
        message: 'The 1 field must be defined',
        rule: 'required',
        index: 1,
      },
      {
        field: 'top_scores.2',
        message: 'The 2 field must be defined',
        rule: 'required',
        index: 2,
      },
    ])
  })

  test('pass when all elements are defined', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine.tuple([vine.number(), vine.number(), vine.number()]),
    })

    const data = {
      top_scores: [1, 2, 3],
    }
    await assert.validationOutput(vine.validate({ schema, data }), data)
  })

  test('drop unknown properties', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine.tuple([vine.number(), vine.number(), vine.number()]),
    })

    const data = {
      top_scores: [98, 96, 92, 88, 84],
    }
    await assert.validationOutput(vine.validate({ schema, data }), {
      top_scores: [98, 96, 92],
    })
  })
})

test.group('VineTuple | allowUnknownProperties', () => {
  test('fail when tuple elements are missing', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine
        .tuple([vine.number(), vine.number(), vine.number()])
        .allowUnknownProperties(),
    })

    const data = {
      top_scores: [1],
    }
    await assert.validationErrors(vine.validate({ schema, data }), [
      {
        field: 'top_scores.1',
        message: 'The 1 field must be defined',
        rule: 'required',
        index: 1,
      },
      {
        field: 'top_scores.2',
        message: 'The 2 field must be defined',
        rule: 'required',
        index: 2,
      },
    ])
  })

  test('keep unknown elements', async ({ assert }) => {
    const schema = vine.object({
      top_scores: vine
        .tuple([vine.number(), vine.number(), vine.number()])
        .allowUnknownProperties(),
    })

    const data = {
      top_scores: [98, 96, 92, 'foo', 'bar'],
    }
    await assert.validationOutput(vine.validate({ schema, data }), {
      top_scores: [98, 96, 92, 'foo', 'bar'],
    })
  })
})
