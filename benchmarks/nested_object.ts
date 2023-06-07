// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import yup from 'yup'
import vine from '../index.js'

const data = {
  username: 'virk',
  password: 'secret',
  contact: {
    name: 'virk',
    address: 'universe',
  },
}

const zodSchema = z.object({
  username: z.string(),
  password: z.string(),
  contact: z.object({
    name: z.string(),
    address: z.string().optional(),
  }),
})

const yupSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
    contact: yup
      .object({
        name: yup.string().required(),
        address: yup.string(),
      })
      .required(),
  })
  .required()

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

const suite = new Benchmark.Suite()
suite
  .add('Vine', {
    defer: true,
    fn: function (deferred: any) {
      vineSchema({ data })
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Zod', {
    defer: true,
    fn: function (deferred: any) {
      zodSchema
        .parseAsync(data)
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Yup', {
    defer: true,
    fn: function (deferred: any) {
      yupSchema
        .validate(data)
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
