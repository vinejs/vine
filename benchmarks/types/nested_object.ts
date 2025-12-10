import { bench } from '@ark/attest'
import vine from '../../index.ts'
import { type Infer } from '../../src/types.ts'

vine.compile(vine.object({}))

bench('vine nested object', () => {
  const vineSchema = vine.compile(
    vine.object({
      username: vine.string(),
      password: vine.string(),
      contact: vine.object({
        name: vine.string(),
        address: vine.string().optional(),
      }),
    })
  )

  return {} as Infer<typeof vineSchema>
}).types([1, 'instantiations'])
