/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Vine } from '../../src/vine.js'
import { Infer } from '../../src/types.js'

const vine = new Vine()

test.group('Types | Flat schema', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string(),
      is_admin: vine.boolean(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string
      is_admin: boolean
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string().nullable(),
      is_admin: vine.boolean(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | null
      is_admin: boolean
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string().optional().nullable(),
      is_admin: vine.boolean().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | null | undefined
      is_admin: boolean | undefined
    }>()
  })

  test('infer types with transform function', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string().transform((value) => value),
      email: vine.string().nullable().optional(),
      is_admin: vine
        .boolean()
        .nullable()
        .transform((value) => {
          if (value === null) {
            return false
          }

          return value
        }),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | null | undefined
      is_admin: boolean
    }>()
  })

  test('convert keys to camelCase', ({ expectTypeOf }) => {
    const schema = vine
      .schema({
        username: vine.string().transform((value) => value),
        email: vine.string().nullable().optional(),
        is_admin: vine
          .boolean()
          .nullable()
          .transform((value) => {
            if (value === null) {
              return false
            }

            return value
          }),
      })
      .toCamelCase()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | null | undefined
      isAdmin: boolean
    }>()
  })
})

test.group('Types | Nested schema', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string(),
      is_admin: vine.boolean(),
      profile: vine.object({
        twitter_handle: vine.string(),
        github_username: vine.string(),
      }),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string
      is_admin: boolean
      profile: {
        twitter_handle: string
        github_username: string
      }
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string(),
      is_admin: vine.boolean(),
      profile: vine
        .object({
          twitter_handle: vine.string(),
          github_username: vine.string(),
        })
        .nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string
      is_admin: boolean
      profile: {
        twitter_handle: string
        github_username: string
      } | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string().optional(),
      is_admin: vine.boolean(),
      profile: vine
        .object({
          twitter_handle: vine.string(),
          github_username: vine.string().optional(),
        })
        .nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | undefined
      is_admin: boolean
      profile: {
        twitter_handle: string
        github_username: string | undefined
      } | null
    }>()
  })

  test('infer types with transform function', ({ expectTypeOf }) => {
    const schema = vine.schema({
      username: vine.string(),
      email: vine.string().optional(),
      is_admin: vine.boolean(),
      profile: vine
        .object({
          twitter_handle: vine.string(),
          github_username: vine
            .string()
            .nullable()
            .transform((value) => value || true),
        })
        .nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | undefined
      is_admin: boolean
      profile: {
        twitter_handle: string
        github_username: string | true
      } | null
    }>()
  })

  test('convert keys to camelCase', ({ expectTypeOf }) => {
    const schema = vine
      .schema({
        username: vine.string(),
        email: vine.string().optional(),
        is_admin: vine.boolean(),
        profile: vine
          .object({
            twitter_handle: vine.string(),
            github_username: vine.string().nullable(),
          })
          .nullable(),
      })
      .toCamelCase()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | undefined
      isAdmin: boolean
      profile: {
        twitterHandle: string
        githubUsername: string | null
      } | null
    }>()
  })
})

test.group('Types | Object groups', () => {
  test('infer types', ({ expectTypeOf }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .schema({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      | {
          visitor_name: string
          hiring_guide: true
          guide_name: string
          fees: string
        }
      | {
          visitor_name: string
          hiring_guide: false
        }
    >()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .nullable()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      | {
          visitor_name: string
          hiring_guide: true
          guide_name: string
          fees: string
        }
      | {
          visitor_name: string
          hiring_guide: false
        }
      | null
    >()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .optional()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      | {
          visitor_name: string
          hiring_guide: true
          guide_name: string
          fees: string
        }
      | {
          visitor_name: string
          hiring_guide: false
        }
      | undefined
    >()
  })

  test('convert keys to camelCase', ({ expectTypeOf }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .schema({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .toCamelCase()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      | {
          visitorName: string
          hiringGuide: true
          guideName: string
          fees: string
        }
      | {
          visitorName: string
          hiringGuide: false
        }
    >()
  })

  test('infer types when allowUnknownProperties is true', ({ expectTypeOf }) => {
    const guideSchema = vine.group([
      vine.group.if((data) => vine.helpers.isTrue(data.hiring_guide), {
        hiring_guide: vine.literal(true),
        guide_name: vine.string(),
        fees: vine.string(),
      }),
      vine.group.if(() => true, {
        hiring_guide: vine.literal(false),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .allowUnknownProperties()
      .optional()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      | ((
          | {
              visitor_name: string
              hiring_guide: true
              guide_name: string
              fees: string
            }
          | {
              visitor_name: string
              hiring_guide: false
            }
        ) & { [K: string]: unknown })
      | undefined
    >()
  })
})

test.group('Types | Arrays', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      contacts: vine.array(
        vine.object({
          email: vine.string(),
          is_primary: vine.boolean(),
        })
      ),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contacts: {
        email: string
        is_primary: boolean
      }[]
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      contacts: vine
        .array(
          vine.object({
            email: vine.string(),
            is_primary: vine.boolean(),
          })
        )
        .nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contacts:
        | {
            email: string
            is_primary: boolean
          }[]
        | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      contacts: vine
        .array(
          vine.object({
            email: vine.string(),
            is_primary: vine.boolean(),
          })
        )
        .nullable()
        .optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contacts:
        | {
            email: string
            is_primary: boolean
          }[]
        | null
        | undefined
    }>()
  })

  test('convert keys to camelCase', ({ expectTypeOf }) => {
    const schema = vine
      .schema({
        contacts: vine
          .array(
            vine.object({
              email: vine.string(),
              is_primary: vine.boolean(),
            })
          )
          .nullable()
          .optional(),
      })
      .toCamelCase()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contacts:
        | {
            email: string
            isPrimary: boolean
          }[]
        | null
        | undefined
    }>()
  })
})

test.group('Types | Tuples', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string]
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]).nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string] | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]).nullable().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string] | null | undefined
    }>()
  })

  test('allow unknown properties', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine
        .tuple([vine.string(), vine.string(), vine.string()])
        .allowUnknownProperties()
        .nullable()
        .optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string, ...unknown[]] | null | undefined
    }>()
  })

  test('convert keys to camelCase', ({ expectTypeOf }) => {
    const schema = vine
      .schema({
        colors: vine
          .tuple([
            vine.string(),
            vine.string(),
            vine.object({
              primary_1: vine.string(),
            }),
          ])
          .allowUnknownProperties()
          .nullable()
          .optional(),
      })
      .toCamelCase()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, { primary1: string }, ...unknown[]] | null | undefined
    }>()
  })
})

test.group('Types | Union', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      contact: vine.union([
        vine.union.if(
          (value) => vine.helpers.isObject(value) && 'email' in value,
          vine.object({
            email: vine.string(),
            otp: vine.string(),
          })
        ),
        vine.union.if(
          (value) => vine.helpers.isObject(value) && 'username' in value,
          vine.object({
            username: vine.string(),
            password: vine.string(),
          })
        ),
      ]),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contact:
        | {
            email: string
            otp: string
          }
        | {
            username: string
            password: string
          }
    }>()
  })

  test('infer types of nested unions', ({ expectTypeOf }) => {
    const schema = vine.schema({
      contact: vine.union([
        vine.union.if(
          (value) => vine.helpers.isObject(value) && 'email' in value,
          vine.union([
            vine.union.if(
              (value) => vine.helpers.isObject(value) && 'otp' in value,
              vine.object({
                otp: vine.string(),
              })
            ),
            vine.union.else(
              vine.object({
                email: vine.string(),
              })
            ),
          ])
        ),
        vine.union.if(
          (value) => vine.helpers.isObject(value) && 'username' in value,
          vine.object({
            username: vine.string(),
            password: vine.string(),
          })
        ),
      ]),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      contact:
        | {
            email: string
          }
        | {
            otp: string
          }
        | {
            username: string
            password: string
          }
    }>()
  })
})

test.group('Types | Record', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: {
        [K: string]: string
      }
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()).nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: {
        [K: string]: string
      } | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      colors: vine.record(vine.string()).optional().nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors:
        | {
            [K: string]: string
          }
        | undefined
        | null
    }>()
  })

  test('infer union record types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      /**
       * @todo: Use union of types here
       */
      colors: vine.record(vine.string()),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: {
        [K: string]: string
      }
    }>()
  })
})

test.group('Types | Enum', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.schema({
      role: vine.enum(['admin', 'moderator', 'writer']),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: 'admin' | 'moderator' | 'writer'
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      role: vine.enum(['admin', 'moderator', 'writer']).nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: 'admin' | 'moderator' | 'writer' | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.schema({
      role: vine.enum(['admin', 'moderator', 'writer']).nullable().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: 'admin' | 'moderator' | 'writer' | null | undefined
    }>()
  })

  test('infer types from native enum', ({ expectTypeOf }) => {
    enum Role {
      MODERATOR = 'moderator',
      WRITER = 'writer',
      ADMIN = 'admin',
    }

    const schema = vine.schema({
      role: vine.enum(Role).nullable().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: Role | null | undefined
    }>()
  })
})
