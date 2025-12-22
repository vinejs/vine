import { bench } from '@ark/attest'
import vine from '../../index.ts'
import { type Infer } from '../../src/types.ts'

vine.create(vine.object({}))

bench('vine nested object', () => {
  const vineSchema = vine.create({
    username: vine.string(),
    password: vine.string(),
    contact: vine.object({
      name: vine.string(),
      address: vine.string().optional(),
    }),
  })

  const result = {} as Infer<typeof vineSchema>
  return result
}).types([1, 'instantiations'])
