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
  trimRule,
  regexRule,
  alphaRule,
  emailRule,
  stringRule,
  mobileRule,
  hexCodeRule,
  endsWithRule,
  confirmedRule,
  activeUrlRule,
  minLengthRule,
  maxLengthRule,
  startsWithRule,
  fixedLengthRule,
  alphaNumericRule,
  normalizeEmailRule,
  sameAsRule,
  notSameAsRule,
  inRule,
  notInRule,
  ipAddressRule,
  creditCardRule,
  passportRule,
  postalCodeRule,
  uuidRule,
  asciiRule,
  ibanRule,
  jwtRule,
  coordinatesRule,
  toUpperCaseRule,
  toLowerCaseRule,
  toCamelCaseRule,
  escapeRule,
  encodeRule,
} from '../../../src/schema/string/rules.js'
import type { FieldContext, Validation } from '../../../src/types.js'

type DataSet = {
  errorsCount?: number
  error?: string
  bail?: boolean
  rule: Validation<any>
  value: any
  output?: any
  field?: Partial<FieldContext>
}

/**
 * Helpers to run string schema type validations
 */
async function stringRuleValidator(_: any, dataset: DataSet) {
  const string = stringRule()
  const validated = dataset.rule.rule.isAsync
    ? await validator
        .bail(dataset.bail === false ? false : true)
        .withContext(dataset.field || {})
        .executeAsync([string, dataset.rule], dataset.value)
    : validator
        .bail(dataset.bail === false ? false : true)
        .withContext(dataset.field || {})
        .execute([string, dataset.rule], dataset.value)

  if (dataset.error && dataset.errorsCount) {
    validated.assertErrorsCount(dataset.errorsCount)
    validated.assertError(dataset.error)
  } else {
    validated.assertSucceeded()
    validated.assertOutput(dataset.output || dataset.value)
  }
}

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
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: emailRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: emailRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: emailRule(),
        value: 'foo',
        error: 'The dummy field must be a valid email address',
      },
      {
        rule: emailRule(),
        value: 'foo@bar.com',
      },
      {
        rule: emailRule({ allow_display_name: true }),
        value: 'Foo <foo@bar.com>',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | mobile', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: mobileRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: mobileRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: mobileRule(),
        value: '20202',
        error: 'The dummy field must be a valid mobile phone number',
      },
      {
        rule: mobileRule(),
        value: '804 225 1616',
      },
      {
        errorsCount: 1,
        rule: mobileRule({ locales: ['en-IN'] }),
        value: '(555) 555-1234',
        error: 'The dummy field must be a valid mobile phone number',
      },
      {
        rule: mobileRule({ locales: ['en-IN'] }),
        value: '9883443344',
      },
      {
        rule: mobileRule({ locales: ['en-IN', 'en-US'] }),
        value: '(555) 555-1234',
      },
      {
        rule: mobileRule({ locales: ['en-IN', 'en-US'] }),
        value: '9883443344',
      },
      {
        rule: mobileRule({ locales: ['en-IN', 'en-US'], strictMode: true }),
        value: '+1 (555) 555-1234',
      },
      {
        rule: mobileRule({ locales: ['en-IN', 'en-US'], strictMode: true }),
        value: '+919883443344',
      },
      {
        rule: mobileRule(() => {
          return { locales: ['en-IN', 'en-US'] }
        }),
        value: '(555) 555-1234',
      },
      {
        rule: mobileRule(() => {
          return { locales: ['en-IN', 'en-US'] }
        }),
        value: '9883443344',
      },
      {
        rule: mobileRule(() => {
          return {}
        }),
        value: '(555) 555-1234',
      },
      {
        rule: mobileRule(() => {
          return {}
        }),
        value: '9883443344',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | hexCode', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: hexCodeRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: hexCodeRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: hexCodeRule(),
        value: 'fff',
        error: 'The dummy field must be a valid hex color code',
      },
      {
        errorsCount: 1,
        rule: hexCodeRule(),
        value: 'red',
        error: 'The dummy field must be a valid hex color code',
      },
      {
        rule: hexCodeRule(),
        value: '#fff',
      },
      {
        rule: hexCodeRule(),
        value: '#ffffff',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | url', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: urlRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: urlRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: urlRule(),
        value: 'foo_bar',
        error: 'The dummy field must be a valid URL',
      },
      {
        errorsCount: 1,
        rule: urlRule({ allow_underscores: false }),
        value: 'https://foo_bar.com',
        error: 'The dummy field must be a valid URL',
      },
      {
        rule: urlRule(),
        value: 'https://google.com',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | activeUrl', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: activeUrlRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: activeUrlRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: activeUrlRule(),
        value: 'foo_bar',
        error: 'The dummy field must be a valid URL',
      },
      {
        errorsCount: 1,
        rule: activeUrlRule(),
        value: 'https://foo.com',
        error: 'The dummy field must be a valid URL',
      },
      {
        rule: activeUrlRule(),
        value: 'https://google.com',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | regex', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: regexRule(/^[a-zA-Z0-9]+$/),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: regexRule(/^[a-zA-Z0-9]+$/),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: regexRule(/^[a-zA-Z0-9]+$/),
        value: 'foo_bar',
        error: 'The dummy field format is invalid',
      },
      {
        rule: regexRule(/^[a-zA-Z0-9]+$/),
        value: 'hello',
      },
      {
        rule: regexRule(/^[a-zA-Z0-9]+$/),
        value: 'hello1234',
      },
      {
        rule: regexRule(new RegExp('^[a-zA-Z0-9]+$')),
        value: 'hello',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | alpha', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: alphaRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: alphaRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: alphaRule(),
        value: 'foo_bar',
        error: 'The dummy field must contain only letters',
      },
      {
        rule: alphaRule(),
        value: 'hello',
      },
      {
        rule: alphaRule({ allowSpaces: true }),
        value: 'hello world',
      },
      {
        rule: alphaRule({ allowUnderscores: true }),
        value: 'hello_world',
      },
      {
        rule: alphaRule({ allowDashes: true }),
        value: 'hello-world',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | alphaNumeric', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: alphaNumericRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: alphaNumericRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: alphaNumericRule(),
        value: 'foo_bar',
        error: 'The dummy field must contain only letters and numbers',
      },
      {
        rule: alphaNumericRule(),
        value: 'hello1244',
      },
      {
        rule: alphaNumericRule({ allowSpaces: true }),
        value: 'hello 1244',
      },
      {
        rule: alphaNumericRule({ allowUnderscores: true }),
        value: 'hello_1244',
      },
      {
        rule: alphaNumericRule({ allowDashes: true }),
        value: 'hello-1244',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | minLength', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: minLengthRule({ min: 10 }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: minLengthRule({ min: 10 }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: minLengthRule({ min: 10 }),
        value: 'foo_bar',
        error: 'The dummy field must have at least 10 characters',
      },
      {
        rule: minLengthRule({ min: 10 }),
        value: 'hello_universe',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | maxLength', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: maxLengthRule({ max: 10 }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: maxLengthRule({ max: 10 }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: maxLengthRule({ max: 10 }),
        value: 'hello_universe',
        error: 'The dummy field must not be greater than 10 characters',
      },
      {
        rule: maxLengthRule({ max: 10 }),
        value: 'foo_bar',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | fixedLength', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: fixedLengthRule({ size: 10 }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: fixedLengthRule({ size: 10 }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: fixedLengthRule({ size: 10 }),
        value: 'hello_universe',
        error: 'The dummy field must be 10 characters long',
      },
      {
        errorsCount: 1,
        rule: fixedLengthRule({ size: 10 }),
        value: 'foo',
        error: 'The dummy field must be 10 characters long',
      },
      {
        rule: fixedLengthRule({ size: 10 }),
        value: 'helloworld',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | confirmed', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: confirmedRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: confirmedRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: confirmedRule(),
        value: 'foo',
        error: 'The dummy field and dummy_confirmation field must be the same',
      },
      {
        errorsCount: 1,
        rule: confirmedRule(),
        value: 'foo',
        field: {
          parent: {
            dummy_confirmation: '',
          },
        },
        error: 'The dummy field and dummy_confirmation field must be the same',
      },
      {
        rule: confirmedRule(),
        value: 'foo',
        field: {
          parent: {
            dummy_confirmation: 'foo',
          },
        },
      },
      {
        rule: confirmedRule({ confirmationField: 'dummyConfirmed' }),
        value: 'foo',
        field: {
          parent: {
            dummyConfirmed: 'foo',
          },
        },
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | trim', () => {
  test('trim whitespaces from: {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: trimRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: trimRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: trimRule(),
        value: ' hello worl  ',
        output: 'hello worl',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | normalizeEmail', () => {
  test('normalize email: {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: normalizeEmailRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: normalizeEmailRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: normalizeEmailRule(),
        value: 'FOO@bar.com',
        output: 'foo@bar.com',
      },
      {
        rule: normalizeEmailRule(),
        value: 'foo.bar@gmail.com',
        output: 'foobar@gmail.com',
      },
      {
        rule: normalizeEmailRule({ gmail_remove_dots: false }),
        value: 'foo.bar@gmail.com',
        output: 'foo.bar@gmail.com',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | startsWith', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: startsWithRule({ substring: 'foo' }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: startsWithRule({ substring: 'foo' }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: startsWithRule({ substring: 'foo' }),
        value: 'hello world',
        error: 'The dummy field must start with foo',
      },
      {
        rule: startsWithRule({ substring: 'foo' }),
        value: 'foo world',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | endsWith', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: endsWithRule({ substring: 'foo' }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: endsWithRule({ substring: 'foo' }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: endsWithRule({ substring: 'foo' }),
        value: 'hello world',
        error: 'The dummy field must end with foo',
      },
      {
        rule: endsWithRule({ substring: 'foo' }),
        value: 'world foo',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | sameAs', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: sameAsRule({ otherField: 'password' }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: sameAsRule({ otherField: 'password' }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: sameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
        },
        error: 'The password_confirmation field and password field must be the same',
      },
      {
        errorsCount: 1,
        rule: sameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
          parent: {
            password: '',
          },
        },
        error: 'The password_confirmation field and password field must be the same',
      },
      {
        rule: sameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
          parent: {
            password: 'foo',
          },
        },
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | notSameAs', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: notSameAsRule({ otherField: 'password' }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: notSameAsRule({ otherField: 'password' }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: notSameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
        },
      },
      {
        errorsCount: 1,
        rule: notSameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
          parent: {
            password: 'foo',
          },
        },
        error: 'The password_confirmation field and password field must be different',
      },
      {
        rule: notSameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
          parent: {
            password: 'bar',
          },
        },
      },
      {
        rule: notSameAsRule({ otherField: 'password' }),
        value: 'foo',
        field: {
          name: 'password_confirmation',
          parent: {
            password: '',
          },
        },
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | in', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: inRule({ choices: ['admin', 'moderator', 'writer'] }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: inRule({ choices: ['admin', 'moderator', 'writer'] }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: inRule({ choices: ['admin', 'moderator', 'writer'] }),
        value: 'foo',
        error: 'The selected dummy is invalid',
      },
      {
        rule: inRule({ choices: ['admin', 'moderator', 'writer'] }),
        value: 'admin',
      },
      {
        errorsCount: 1,
        rule: inRule({ choices: () => ['admin', 'moderator', 'writer'] }),
        value: 'foo',
        error: 'The selected dummy is invalid',
      },
      {
        rule: inRule({ choices: () => ['admin', 'moderator', 'writer'] }),
        value: 'admin',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | notIn', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: notInRule({ list: ['admin', 'moderator', 'writer'] }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: notInRule({ list: ['admin', 'moderator', 'writer'] }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: notInRule({ list: ['admin', 'moderator', 'writer'] }),
        value: 'admin',
        error: 'The selected dummy is invalid',
      },
      {
        rule: notInRule({ list: ['admin', 'moderator', 'writer'] }),
        value: 'root',
      },
      {
        errorsCount: 1,
        rule: notInRule({ list: () => ['admin', 'moderator', 'writer'] }),
        value: 'admin',
        error: 'The selected dummy is invalid',
      },
      {
        rule: notInRule({ list: () => ['admin', 'moderator', 'writer'] }),
        value: 'root',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | ipAddress', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: ipAddressRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: ipAddressRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: ipAddressRule(),
        value: 'foobar',
        error: 'The dummy field must be a valid IP address',
      },
      {
        rule: ipAddressRule(),
        value: '192.168.1.2',
      },
      {
        rule: ipAddressRule(),
        value: '::1234:5678',
      },
      {
        rule: ipAddressRule({ version: 4 }),
        value: '192.168.1.2',
      },
      {
        rule: ipAddressRule({ version: 6 }),
        value: '::1234:5678',
      },
      {
        errorsCount: 1,
        rule: ipAddressRule({ version: 6 }),
        value: '192.168.1.2',
        error: 'The dummy field must be a valid IP address',
      },
      {
        errorsCount: 1,
        rule: ipAddressRule({ version: 4 }),
        value: '::1234:5678',
        error: 'The dummy field must be a valid IP address',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | creditCard', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: creditCardRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: creditCardRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: creditCardRule(),
        value: '123456789',
        error: 'The dummy field must be a valid credit card number',
      },
      {
        rule: creditCardRule(),
        value: '30569309025904',
      },
      {
        errorsCount: 1,
        rule: creditCardRule({ provider: ['amex'] }),
        value: '30569309025904',
        error: 'The dummy field must be a valid amex card number',
      },
      {
        errorsCount: 1,
        rule: creditCardRule({ provider: ['amex', 'visa'] }),
        value: '30569309025904',
        error: 'The dummy field must be a valid amex/visa card number',
      },
      {
        rule: creditCardRule({ provider: ['amex', 'visa', 'dinersclub'] }),
        value: '30569309025904',
      },
      {
        rule: creditCardRule(() => {}),
        value: '30569309025904',
      },
      {
        errorsCount: 1,
        rule: creditCardRule(() => {
          return { provider: ['amex'] }
        }),
        value: '30569309025904',
        error: 'The dummy field must be a valid amex card number',
      },
      {
        errorsCount: 1,
        rule: creditCardRule(() => {
          return { provider: ['amex', 'visa'] }
        }),
        value: '30569309025904',
        error: 'The dummy field must be a valid amex/visa card number',
      },
      {
        rule: creditCardRule(() => {
          return { provider: ['amex', 'visa', 'dinersclub'] }
        }),
        value: '30569309025904',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | passport', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: passportRule({ countryCode: ['IN'] }),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: passportRule({ countryCode: ['IN'] }),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: passportRule({ countryCode: ['IN'] }),
        value: '1999010301',
        error: 'The dummy field must be a valid passport number',
      },
      {
        rule: passportRule({ countryCode: ['IN'] }),
        value: 'J8369854',
      },
      {
        rule: passportRule({ countryCode: ['US'] }),
        value: 'J8369854',
        errorsCount: 1,
        error: 'The dummy field must be a valid passport number',
      },
      {
        rule: passportRule({ countryCode: ['IN', 'US'] }),
        value: 'J8369854',
      },
      {
        errorsCount: 1,
        rule: passportRule(() => {
          return { countryCode: ['IN'] }
        }),
        value: '1999010301',
        error: 'The dummy field must be a valid passport number',
      },
      {
        rule: passportRule(() => {
          return { countryCode: ['IN'] }
        }),
        value: 'J8369854',
      },
      {
        rule: passportRule(() => {
          return { countryCode: ['US'] }
        }),
        value: 'J8369854',
        errorsCount: 1,
        error: 'The dummy field must be a valid passport number',
      },
      {
        rule: passportRule(() => {
          return { countryCode: ['IN', 'US'] }
        }),
        value: 'J8369854',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | postalCode', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: postalCodeRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: postalCodeRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: postalCodeRule(),
        value: '1999010301',
        error: 'The dummy field must be a valid postal code',
      },
      {
        rule: postalCodeRule(),
        value: '110001',
      },
      {
        errorsCount: 1,
        rule: postalCodeRule({ countryCode: ['US'] }),
        value: '110001',
        error: 'The dummy field must be a valid postal code',
      },
      {
        rule: postalCodeRule({ countryCode: ['US', 'IN'] }),
        value: '110001',
      },
      {
        errorsCount: 1,
        rule: postalCodeRule(() => {}),
        value: '1999010301',
        error: 'The dummy field must be a valid postal code',
      },
      {
        rule: postalCodeRule(() => {}),
        value: '110001',
      },
      {
        errorsCount: 1,
        rule: postalCodeRule(() => {
          return { countryCode: ['US'] }
        }),
        value: '110001',
        error: 'The dummy field must be a valid postal code',
      },
      {
        rule: postalCodeRule(() => {
          return { countryCode: ['US', 'IN'] }
        }),
        value: '110001',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | uuid', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: uuidRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: uuidRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: uuidRule(),
        value: '1999010301',
        error: 'The dummy field must be a valid UUID',
      },
      {
        rule: uuidRule(),
        value: '71e4fbab-3498-447b-a97c-2c6060069678',
      },
      {
        errorsCount: 1,
        rule: uuidRule({ version: [1] }),
        value: '71e4fbab-3498-447b-a97c-2c6060069678',
        error: 'The dummy field must be a valid UUID',
      },
      {
        rule: uuidRule({ version: [1, 4] }),
        value: '71e4fbab-3498-447b-a97c-2c6060069678',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | ascii', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: asciiRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: asciiRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: asciiRule(),
        value: '１２３456',
        error: 'The dummy field must only contain ASCII characters',
      },
      {
        rule: asciiRule(),
        value: 'foobar',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | iban', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: ibanRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: ibanRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: ibanRule(),
        value: 'foobar',
        error: 'The dummy field must be a valid IBAN number',
      },
      {
        rule: ibanRule(),
        value: 'GB94BARC10201530093459',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | jwt', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: jwtRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: jwtRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: jwtRule(),
        value: 'foobar',
        error: 'The dummy field must be a valid JWT token',
      },
      {
        rule: jwtRule(),
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | coordinates', () => {
  test('validate {value}')
    .with([
      {
        errorsCount: 1,
        rule: coordinatesRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: coordinatesRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: coordinatesRule(),
        value: 'helloworld',
        error: 'The dummy field must contain latitude and longitude coordinates',
      },
      {
        errorsCount: 1,
        rule: coordinatesRule(),
        value: 'hello,world',
        error: 'The dummy field must contain latitude and longitude coordinates',
      },
      {
        rule: coordinatesRule(),
        value: '(7.264394, 165.058594)',
      },
      {
        rule: coordinatesRule(),
        value: '7.264394,165.058594',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | toUpperCase', () => {
  test('convert {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: toUpperCaseRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: toUpperCaseRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: toUpperCaseRule(),
        value: 'hello world',
        output: 'HELLO WORLD',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | toLowerCase', () => {
  test('convert {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: toLowerCaseRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: toLowerCaseRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: toLowerCaseRule(),
        value: 'HELLO WORLD',
        output: 'hello world',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | toCamelCase', () => {
  test('convert {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: toCamelCaseRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: toCamelCaseRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: toCamelCaseRule(),
        value: 'HELLO WORLD',
        output: 'helloWorld',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | escape', () => {
  test('convert {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: escapeRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: escapeRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: escapeRule(),
        value: '<h1> Hello world </h1>',
        output: '&lt;h1&gt; Hello world &lt;/h1&gt;',
      },
    ])
    .run(stringRuleValidator)
})

test.group('String | encode', () => {
  test('convert {value} to {output}')
    .with([
      {
        errorsCount: 1,
        rule: encodeRule(),
        value: 22,
        error: 'The dummy field must be a string',
      },
      {
        errorsCount: 1,
        rule: encodeRule(),
        value: 22,
        bail: false,
        error: 'The dummy field must be a string',
      },
      {
        rule: encodeRule(),
        value: 'foo © and & ampersand',
        output: 'foo &#xA9; and &#x26; ampersand',
      },
      {
        rule: encodeRule({ allowUnsafeSymbols: true }),
        value: 'foo © and & ampersand',
        output: 'foo &#xA9; and & ampersand',
      },
    ])
    .run(stringRuleValidator)
})
