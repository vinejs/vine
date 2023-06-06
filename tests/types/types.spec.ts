/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Vine } from '../../src/vine/main.js'
import { Infer } from '../../src/types.js'

const vine = new Vine()

test.group('Types | Flat schema', () => {
  test('infer types', ({ expectTypeOf }) => {
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
      .object({
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

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine
      .object({
        username: vine
          .string()
          .clone()
          .transform((value) => value),
        email: vine.string().nullable().optional().clone(),
        is_admin: vine
          .boolean()
          .nullable()
          .transform((value) => {
            if (value === null) {
              return false
            }

            return value
          })
          .clone(),
      })
      .toCamelCase()
      .clone()

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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
      .object({
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

  test('convert nested object keys to camelCase', ({ expectTypeOf }) => {
    const schema = vine.object({
      username: vine.string(),
      email: vine.string().optional(),
      is_admin: vine.boolean(),
      profile: vine
        .object({
          twitter_handle: vine.string(),
          github_username: vine.string().nullable(),
        })
        .toCamelCase()
        .nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      username: string
      email: string | undefined
      is_admin: boolean
      profile: {
        twitterHandle: string
        githubUsername: string | null
      } | null
    }>()
  })

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine
      .object({
        username: vine.string().clone(),
        email: vine.string().optional().clone(),
        is_admin: vine.boolean(),
        profile: vine
          .object({
            twitter_handle: vine.string(),
            github_username: vine.string().nullable(),
          })
          .clone()
          .nullable(),
      })
      .clone()
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
      .object({
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

  test('infer types with multiple groups', ({ expectTypeOf }) => {
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

    const monumentSchema = vine.group([
      vine.group.if((data) => data.monument === 'foo', {
        monument: vine.literal('foo'),
        available_transport: vine.enum(['bus', 'train']),
        has_free_entry: vine.literal(false),
      }),
      vine.group.if((data) => data.monument === 'bar', {
        monument: vine.literal('bar'),
        available_transport: vine.enum(['bus', 'car']),
        has_free_entry: vine.literal(true),
      }),
    ])

    const schema = vine
      .object({
        visitor_name: vine.string(),
      })
      .merge(guideSchema)
      .merge(monumentSchema)

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<
      {
        visitor_name: string
      } & (
        | {
            hiring_guide: true
            guide_name: string
            fees: string
          }
        | {
            hiring_guide: false
          }
      ) &
        (
          | {
              monument: 'foo'
              available_transport: 'bus' | 'train'
              has_free_entry: false
            }
          | {
              monument: 'bar'
              available_transport: 'bus' | 'car'
              has_free_entry: true
            }
        )
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
      .object({
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

  test('clone types', ({ expectTypeOf }) => {
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
        visitor_name: vine.string().clone(),
      })
      .merge(guideSchema)
      .allowUnknownProperties()
      .optional()
      .clone()

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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
      .object({
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

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine
      .object({
        contacts: vine
          .array(
            vine.object({
              email: vine.string().clone(),
              is_primary: vine.boolean().clone(),
            })
          )
          .nullable()
          .clone()
          .optional(),
      })
      .toCamelCase()
      .clone()

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
    const schema = vine.object({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string]
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.object({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]).nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string] | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.object({
      colors: vine.tuple([vine.string(), vine.string(), vine.string()]).nullable().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      colors: [string, string, string] | null | undefined
    }>()
  })

  test('allow unknown properties', ({ expectTypeOf }) => {
    const schema = vine.object({
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
      .object({
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

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine
      .object({
        colors: vine
          .tuple([
            vine.string().clone(),
            vine.string().clone(),
            vine
              .object({
                primary_1: vine.string(),
              })
              .clone(),
          ])
          .allowUnknownProperties()
          .nullable()
          .clone()
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
    const schema = vine.object({
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
    const schema = vine.object({
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

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine.object({
      contact: vine
        .union([
          vine.union.if(
            (value) => vine.helpers.isObject(value) && 'email' in value,
            vine.union([
              vine.union.if(
                (value) => vine.helpers.isObject(value) && 'otp' in value,
                vine
                  .object({
                    otp: vine.string(),
                  })
                  .clone()
              ),
              vine.union.else(
                vine
                  .object({
                    email: vine.string(),
                  })
                  .clone()
              ),
            ])
          ),
          vine.union.if(
            (value) => vine.helpers.isObject(value) && 'username' in value,
            vine.object({
              username: vine.string().clone(),
              password: vine.string().clone(),
            })
          ),
        ])
        .clone(),
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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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
    const schema = vine.object({
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

  test('clone types', ({ expectTypeOf }) => {
    const schema = vine.object({
      /**
       * @todo: Use union of types here
       */
      colors: vine.record(vine.string()).clone(),
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
    const schema = vine
      .object({
        role: vine.enum(['admin', 'moderator', 'writer']),
      })
      .clone()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: 'admin' | 'moderator' | 'writer'
    }>()
  })

  test('infer types with nullable fields', ({ expectTypeOf }) => {
    const schema = vine.object({
      role: vine.enum(['admin', 'moderator', 'writer']).nullable(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: 'admin' | 'moderator' | 'writer' | null
    }>()
  })

  test('infer types with optional fields', ({ expectTypeOf }) => {
    const schema = vine.object({
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

    const schema = vine.object({
      role: vine.enum(Role).nullable().optional(),
    })

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: Role | null | undefined
    }>()
  })

  test('clone types', ({ expectTypeOf }) => {
    enum Role {
      MODERATOR = 'moderator',
      WRITER = 'writer',
      ADMIN = 'admin',
    }

    const schema = vine
      .object({
        role: vine.enum(Role).nullable().optional().clone(),
      })
      .clone()

    type Schema = Infer<typeof schema>
    expectTypeOf<Schema>().toEqualTypeOf<{
      role: Role | null | undefined
    }>()
  })
})
