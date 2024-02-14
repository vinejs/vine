// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import * as yup from 'yup'
import vine from '../index.js'

function getData() {
  return {
    username: 'virk',
    password: 'secret',
    contact: {
      name: 'virk',
      address: 'universe',
    },
  }
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

console.log('=================================')
console.log('Benchmarking with nested object')
console.log('=================================')

const suite = new Benchmark.Suite()
suite
  .add('Vine', {
    defer: true,
    fn: function (deferred: any) {
      vineSchema.validate(getData()).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn: function (deferred: any) {
      zodSchema.parseAsync(getData()).then(() => deferred.resolve())
    },
  })
  .add('Yup', {
    defer: true,
    fn: function (deferred: any) {
      yupSchema.validate(getData()).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
