// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import yup from 'yup'
import vine from '../index.js'
import Joi from 'joi'
import Ajv, { AsyncSchema } from 'ajv'

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

const joiSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  contact: Joi.object({
    name: Joi.string().required(),
    address: Joi.string(),
  }).required(),
}).required()

const ajv = new Ajv.default()
interface AjvData {
  username: string
  password: string
  contact: {
    name: string
    address?: string
  }
}
const ajvSchema: AsyncSchema = {
  $async: true,
  type: 'object',
  properties: {
    username: { type: 'string', nullable: false },
    password: { type: 'string', nullable: false },
    contact: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: false },
        address: { type: 'string' },
      },
      required: ['name'],
    },
  },
  required: ['username', 'password', 'contact'],
  additionalProperties: false,
}
const ajvValidator = ajv.compile<AjvData>(ajvSchema)

console.log('=================================')
console.log('Benchmarking with nested object')
console.log('=================================')

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
  .add('Joi', {
    defer: true,
    fn: function (deferred: any) {
      joiSchema
        .validateAsync(getData())
        .then(() => deferred.resolve())
        .catch(console.log)
    },
  })
  .add('Ajv', {
    defer: true,
    fn: function (deferred: any) {
      ajvValidator(getData())
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
