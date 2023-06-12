// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import yup from 'yup'
import vine from '../index.js'

function getData() {
  return {
    contacts: [
      {
        type: 'email',
        value: 'foo@bar.com',
      },
      {
        type: 'phone',
        value: '12345678',
      },
    ],
  }
}

const zodSchema = z.object({
  contacts: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    })
  ),
})

const yupSchema = yup
  .object({
    contacts: yup
      .array(
        yup
          .object({
            type: yup.string().required(),
            value: yup.string().required(),
          })
          .required()
      )
      .required(),
  })
  .required()

const vineSchema = vine.compile(
  vine.object({
    contacts: vine.array(
      vine.object({
        type: vine.string(),
        value: vine.string(),
      })
    ),
  })
)

console.log('======================')
console.log('Benchmarking arrays')
console.log('======================')

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
  .add('Yup', {
    defer: true,
    fn: function (deferred: any) {
      yupSchema
        .validate(getData())
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
