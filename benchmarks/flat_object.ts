// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import yup from 'yup'
import vine from '../index.js'

const data = {
  username: 'virk',
  password: 'secret',
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

const suite = new Benchmark.Suite()
suite
  .add('Vine', {
    defer: true,
    fn: function (deferred: any) {
      vineSchema({ data }).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn: function (deferred: any) {
      zodSchema.parseAsync(data).then(() => deferred.resolve())
    },
  })
  .add('Yup', {
    defer: true,
    fn: function (deferred: any) {
      yupSchema.validate(data).then(() => deferred.resolve())
    },
  })
  .on('cycle', function (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })
