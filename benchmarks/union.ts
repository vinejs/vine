// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import vine from '../index.js'

function getData() {
  return {
    contact: {
      type: 'phone',
      mobile_number: '9210210102',
    },
  }
}

const zodSchema = z.object({
  contact: z.union([
    z.object({
      type: z.literal('email'),
      email: z.string(),
    }),
    z.object({
      type: z.literal('phone'),
      mobile_number: z.string(),
    }),
  ]),
})

const vineSchema = vine.compile(
  vine.object({
    contact: vine.union([
      vine.union.if(
        (value) => vine.helpers.isObject(value) && value.type === 'email',
        vine.object({
          type: vine.literal('email'),
          email: vine.string(),
        })
      ),
      vine.union.if(
        (value) => vine.helpers.isObject(value) && value.type === 'phone',
        vine.object({
          type: vine.literal('phone'),
          mobile_number: vine.string(),
        })
      ),
    ]),
  })
)

console.log('=======================')
console.log('Benchmarking unions')
console.log('=======================')

const suite = new Benchmark.Suite()
suite
  .add('Vine', {
    defer: true,
    fn: function (deferred: any) {
      vineSchema
        .validate(getData())
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Zod', {
    defer: true,
    fn: function (deferred: any) {
      zodSchema
        .parseAsync(getData())
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
