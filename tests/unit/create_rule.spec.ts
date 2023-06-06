/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { createRule } from '../../src/vine/create_rule.js'

test.group('Create rule', () => {
  test('create a custom validation rule', ({ assert }) => {
    function validator() {}
    const ruleFn = createRule(validator)

    assert.strictEqual(ruleFn().rule.validator, validator)
  })

  test('infer options from validator', ({ assert, expectTypeOf }) => {
    function validator(_: unknown, __: { foo: string; bar: boolean }) {}
    const ruleFn = createRule(validator)

    expectTypeOf(ruleFn).parameters.toEqualTypeOf<[{ foo: string; bar: boolean }]>()
    assert.deepEqual(ruleFn({ foo: '1', bar: true }).options, { foo: '1', bar: true })
  })

  test('infer optional options from validator', ({ assert, expectTypeOf }) => {
    function validator(_: unknown, __?: { foo: string; bar: boolean }) {}
    const ruleFn = createRule(validator)

    expectTypeOf(ruleFn).parameters.toEqualTypeOf<[{ foo: string; bar: boolean }?]>()
    assert.deepEqual(ruleFn({ foo: '1', bar: true }).options, { foo: '1', bar: true })
  })

  test('infer async validator functions', ({ assert }) => {
    async function validator() {}
    const ruleFn = createRule(validator)

    assert.isTrue(ruleFn().rule.isAsync)
  })

  test('mark validation as implicit', ({ assert }) => {
    async function validator() {}
    const ruleFn = createRule(validator, { implicit: true })

    assert.isTrue(ruleFn().rule.implicit)
  })

  test('do not allow marking async functions as non-async', ({ assert }) => {
    async function validator() {}
    const ruleFn = createRule(validator, { implicit: true, isAsync: false })

    assert.isTrue(ruleFn().rule.isAsync)
  })

  test('allow marking functions as async', ({ assert }) => {
    function validator() {}
    const ruleFn = createRule(validator, { implicit: true, isAsync: true })

    assert.isTrue(ruleFn().rule.isAsync)
  })

  test('allow marking non async functions as non-async', ({ assert }) => {
    function validator() {}
    const ruleFn = createRule(validator, { implicit: true, isAsync: false })

    assert.isFalse(ruleFn().rule.isAsync)
  })
})
