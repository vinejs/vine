// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import * as yup from 'yup'
import vine from '../index.js'
import * as valibot from 'valibot'

function getData() {
  return {
    username: 'virk',
    password: 'secret',
  }
}

const zodSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const yupSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required()

const vineSchema = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
  })
)

const valibotSchema = valibot.object({
  username: valibot.string(),
  password: valibot.string(),
})

console.log('===============================')
console.log('Benchmarking with flat object')
console.log('===============================')

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
  .add('Valibot', {
    defer: true,
    fn: function (deferred: any) {
      valibot.parseAsync(valibotSchema, getData()).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
