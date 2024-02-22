// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import vine from '../index.js'
import * as valibot from 'valibot'
import Joi from 'joi'
import Ajv, { AsyncSchema } from 'ajv'

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

const valibotSchema = valibot.object({
  contact: valibot.union([
    valibot.object({
      type: valibot.literal('email'),
      email: valibot.string(),
    }),
    valibot.object({
      type: valibot.literal('phone'),
      mobile_number: valibot.string(),
    }),
  ]),
})

const joiSchema = Joi.object({
  contact: Joi.alternatives()
    .try(
      Joi.object({ type: 'email', email: Joi.string().required() }),
      Joi.object({ type: 'phone', mobile_number: Joi.string().required() })
    )
    .required(),
}).required()

const ajv = new Ajv.default({ discriminator: true })
interface AjvEmail {
  type: 'email'
  email: string
}
interface AjvPhone {
  type: 'phone'
  mobile_number: string
}
interface AjvData {
  contact: AjvEmail | AjvPhone
}
const ajvSchema: AsyncSchema = {
  $async: true,
  type: 'object',
  properties: {
    contact: {
      type: 'object',
      discriminator: { propertyName: 'type' },
      required: ['type'],
      oneOf: [
        {
          properties: {
            type: { const: 'email' },
            email: { type: 'string', nullable: false },
          },
          required: ['email'],
        },
        {
          properties: {
            type: { const: 'phone' },
            mobile_number: { type: 'string', nullable: false },
          },
          required: ['mobile_number'],
        },
      ],
    },
  },
  required: ['contact'],
  additionalProperties: false,
}
const ajvValidator = ajv.compile<AjvData>(ajvSchema)

console.log('=======================')
console.log('Benchmarking unions')
console.log('=======================')

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
  .add('Valibot', {
    defer: true,
    fn: function (deferred: any) {
      valibot.parseAsync(valibotSchema, getData()).then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn: function (deferred: any) {
      joiSchema
        .validateAsync(getData())
        .then(() => deferred.resolve())
        .catch((err) => console.dir(err, { depth: 20, colors: true }))
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
  .run({ async: true })
