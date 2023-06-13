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
import {
  urlRule,
  emailRule,
  stringRule,
  mobileRule,
  hexCodeRule,
  activeUrlRule,
  regexRule,
  alphaRule,
  alphaNumericRule,
} from '../../../src/schema/string/rules.js'

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

test.group('String | url', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const rule = urlRule()
    const validated = validator.execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const rule = urlRule()
    const validated = validator.bail(false).execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value is not a valid URL', () => {
    const string = stringRule()
    const url = urlRule()
    const validated = validator.execute([string, url], '20202')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid URL')
  })

  test('pass validation when value is a valid URL', () => {
    const string = stringRule()
    const url = urlRule()
    const validated = validator.execute([string, url], 'https://foo.com')

    validated.assertSucceeded()
    validated.assertOutput('https://foo.com')
  })

  test('define url options', () => {
    const string = stringRule()
    const url = urlRule({ allow_underscores: false })
    const validated = validator.execute([string, url], 'https://foo_bar.com')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid URL')
  })
})

test.group('String | activeUrl', () => {
  test('skip when field is invalid', async () => {
    const string = stringRule()
    const rule = activeUrlRule()
    const validated = await validator.executeAsync([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', async () => {
    const string = stringRule()
    const rule = activeUrlRule()
    const validated = await validator.bail(false).executeAsync([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value is not a valid URL', async () => {
    const string = stringRule()
    const url = activeUrlRule()
    const validated = await validator.executeAsync([string, url], '20202')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid URL')
  })

  test('fail when value is not an active URL', async () => {
    const string = stringRule()
    const url = activeUrlRule()
    const validated = await validator.executeAsync([string, url], 'https://foo.com')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a valid URL')
  })

  test('pass validation when value is an active URL', async () => {
    const string = stringRule()
    const url = activeUrlRule()
    const validated = await validator.executeAsync([string, url], 'https://google.com')

    validated.assertSucceeded()
    validated.assertOutput('https://google.com')
  })
})

test.group('String | regex', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const rule = regexRule(/^[a-zA-Z0-9]+$/)
    const validated = validator.execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const rule = regexRule(/^[a-zA-Z0-9]+$/)
    const validated = validator.bail(false).execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value does not match the regular expression', () => {
    const string = stringRule()
    const rule = regexRule(/^[a-zA-Z0-9]+$/)
    const validated = validator.execute([string, rule], 'foo_bar')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field format is invalid')
  })

  test('test against RegExp instance', () => {
    const string = stringRule()
    const rule = regexRule(new RegExp('^[a-zA-Z0-9]+$'))
    const validated = validator.execute([string, rule], 'foo_bar')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field format is invalid')
  })

  test('pass when value matches the regular expression', () => {
    const string = stringRule()
    const rule = regexRule(new RegExp('^[a-zA-Z0-9]+$'))
    const validated = validator.execute([string, rule], 'hello1234')

    validated.assertSucceeded()
    validated.assertOutput('hello1234')
  })
})

test.group('String | alpha', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const rule = alphaRule()
    const validated = validator.execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const rule = alphaRule()
    const validated = validator.bail(false).execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value contains characters other than letters', () => {
    const string = stringRule()
    const rule = alphaRule()
    const validated = validator.execute([string, rule], 'foo_bar')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must contain only letters')
  })

  test('pass when value contains only letters', () => {
    const string = stringRule()
    const rule = alphaRule()
    const validated = validator.execute([string, rule], 'hello')

    validated.assertSucceeded()
    validated.assertOutput('hello')
  })

  test('pass when value contains only letters and spaces', () => {
    const string = stringRule()
    const rule = alphaRule({ allowSpaces: true })
    const validated = validator.execute([string, rule], 'hell o')

    validated.assertSucceeded()
    validated.assertOutput('hell o')
  })

  test('pass when value contains only letters and underscore', () => {
    const string = stringRule()
    const rule = alphaRule({ allowUnderscores: true })
    const validated = validator.execute([string, rule], 'hell_o')

    validated.assertSucceeded()
    validated.assertOutput('hell_o')
  })

  test('pass when value contains only letters and dashes', () => {
    const string = stringRule()
    const rule = alphaRule({ allowDashes: true })
    const validated = validator.execute([string, rule], 'hell-o')

    validated.assertSucceeded()
    validated.assertOutput('hell-o')
  })
})

test.group('String | alphaNumeric', () => {
  test('skip when field is invalid', () => {
    const string = stringRule()
    const rule = alphaNumericRule()
    const validated = validator.execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('skip when field is invalid with bail mode disabled', () => {
    const string = stringRule()
    const rule = alphaNumericRule()
    const validated = validator.bail(false).execute([string, rule], 22)

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must be a string')
  })

  test('fail when value contains characters other than letters', () => {
    const string = stringRule()
    const rule = alphaNumericRule()
    const validated = validator.execute([string, rule], 'foo_bar')

    validated.assertErrorsCount(1)
    validated.assertError('The dummy field must contain only letters and numbers')
  })

  test('pass when value contains only letters and numbers', () => {
    const string = stringRule()
    const rule = alphaNumericRule()
    const validated = validator.execute([string, rule], 'hello1244')

    validated.assertSucceeded()
    validated.assertOutput('hello1244')
  })

  test('pass when value contains only letters and spaces', () => {
    const string = stringRule()
    const rule = alphaNumericRule({ allowSpaces: true })
    const validated = validator.execute([string, rule], 'hell o12')

    validated.assertSucceeded()
    validated.assertOutput('hell o12')
  })

  test('pass when value contains only letters and underscore', () => {
    const string = stringRule()
    const rule = alphaNumericRule({ allowUnderscores: true })
    const validated = validator.execute([string, rule], 'hell_o12')

    validated.assertSucceeded()
    validated.assertOutput('hell_o12')
  })

  test('pass when value contains only letters and dashes', () => {
    const string = stringRule()
    const rule = alphaNumericRule({ allowDashes: true })
    const validated = validator.execute([string, rule], 'hell-o12')

    validated.assertSucceeded()
    validated.assertOutput('hell-o12')
  })
})
