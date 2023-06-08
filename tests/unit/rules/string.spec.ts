/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { validator } from '../../../factories/main.js'
import { emailRule, hexCodeRule, mobileRule, stringRule } from '../../../src/schema/string/rules.js'

test.group('String | string', () => {
  test('report when value is not a string', () => {
    const string = stringRule()
    const validated = validator.execute(string, 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('pass validation when value is a string', () => {
    const string = stringRule()
    const validated = validator.execute(string, '22')

    validated.assertSucceeded()
    validated.assertOutput('22')
  })
})

test.group('String | email', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const email = emailRule()
    const validated = validator.execute([string, email], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const email = emailRule()
    const validated = validator.bail(false).execute([string, email], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value is not a valid email address', () => {
    const string = stringRule()
    const email = emailRule()
    const validated = validator.execute([string, email], 'foo')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid email address')
  })

  test('pass validation when value is a valid email address', () => {
    const string = stringRule()
    const email = emailRule()
    const validated = validator.execute([string, email], 'foo@bar.com')

    validated.assertSucceeded()
    validated.assertOutput('foo@bar.com')
  })

  test('provide options to allow display name', () => {
    const string = stringRule()
    const email = emailRule({ allow_display_name: true })
    const validated = validator.execute([string, email], 'Foo <foo@bar.com>')

    validated.assertSucceeded()
    validated.assertOutput('Foo <foo@bar.com>')
  })
})

test.group('String | mobile', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const mobile = mobileRule()
    const validated = validator.execute([string, mobile], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const mobile = mobileRule()
    const validated = validator.bail(false).execute([string, mobile], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value is not a valid mobile number', () => {
    const string = stringRule()
    const mobile = mobileRule()
    const validated = validator.execute([string, mobile], '20202')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid mobile phone number')
  })

  test('pass validation when value is a valid mobile number', () => {
    const string = stringRule()
    const mobile = mobileRule()
    const validated = validator.execute([string, mobile], '804 225 1616')

    validated.assertSucceeded()
    validated.assertOutput('804 225 1616')
  })

  test('validate mobile number from a given locale', () => {
    const string = stringRule()
    const mobile = mobileRule({ locales: ['en-IN'] })

    const usValidation = validator.execute([string, mobile], '(555) 555-1234')
    usValidation.assertErrorsCount(1)
    usValidation.assertError('The dummy field must be a valid mobile phone number')

    const inValidation = validator.execute([string, mobile], '9883443344')
    inValidation.assertSucceeded()
    inValidation.assertOutput('9883443344')
  })

  test('validate mobile number from multiple locales', () => {
    const string = stringRule()
    const mobile = mobileRule({ locales: ['en-IN', 'en-US'] })

    const usValidation = validator.execute([string, mobile], '(555) 555-1234')
    usValidation.assertSucceeded()
    usValidation.assertOutput('(555) 555-1234')

    const inValidation = validator.execute([string, mobile], '9883443344')
    inValidation.assertSucceeded()
    inValidation.assertOutput('9883443344')
  })

  test('validate mobile number in strict mode', () => {
    const string = stringRule()
    const mobile = mobileRule({ locales: ['en-IN', 'en-US'], strictMode: true })

    const usValidation = validator.execute([string, mobile], '+1 (555) 555-1234')
    usValidation.assertSucceeded()
    usValidation.assertOutput('+1 (555) 555-1234')

    const inValidation = validator.execute([string, mobile], '+919883443344')
    inValidation.assertSucceeded()
    inValidation.assertOutput('+919883443344')
  })

  test('compute validation options lazily', () => {
    const string = stringRule()
    const mobile = mobileRule(() => {
      return {
        locales: ['en-IN', 'en-US'],
      }
    })

    const usValidation = validator.execute([string, mobile], '(555) 555-1234')
    usValidation.assertSucceeded()
    usValidation.assertOutput('(555) 555-1234')

    const inValidation = validator.execute([string, mobile], '9883443344')
    inValidation.assertSucceeded()
    inValidation.assertOutput('9883443344')
  })

  test('do not return any options from the callback', () => {
    const string = stringRule()
    const mobile = mobileRule(() => {
      return {}
    })

    const usValidation = validator.execute([string, mobile], '(555) 555-1234')
    usValidation.assertSucceeded()
    usValidation.assertOutput('(555) 555-1234')

    const inValidation = validator.execute([string, mobile], '9883443344')
    inValidation.assertSucceeded()
    inValidation.assertOutput('9883443344')
  })
})

test.group('String | hexCode', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const hexCode = hexCodeRule()
    const validated = validator.execute([string, hexCode], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const hexCode = hexCodeRule()
    const validated = validator.bail(false).execute([string, hexCode], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value is not a valid color hex code', () => {
    const string = stringRule()
    const hexCode = hexCodeRule()
    const validated = validator.execute([string, hexCode], '9088')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid hex color code')
  })

  test('pass validation when value is a valid color hexcode', () => {
    const string = stringRule()
    const hexCode = hexCodeRule()

    const threeDigits = validator.execute([string, hexCode], '#fff')
    threeDigits.assertSucceeded()
    threeDigits.assertOutput('#fff')

    const sixDigits = validator.execute([string, hexCode], '#ffffff')
    sixDigits.assertSucceeded()
    sixDigits.assertOutput('#ffffff')
  })
})
