// @ts-ignore
import Benchmark from 'benchmark'
import { z } from 'zod'
import * as yup from 'yup'
import vine from '../index.js'
import * as valibot from 'valibot'
import Joi from 'joi'
import Ajv, { AsyncSchema } from 'ajv'

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

const valibotSchema = valibot.object({
  contacts: valibot.array(
    valibot.object({
      type: valibot.string(),
      value: valibot.string(),
    })
  ),
})

const joiSchema = Joi.object({
  contacts: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required(),
        value: Joi.string().required(),
      })
    )
    .required(),
}).required()

const ajv = new Ajv.default()
interface AjvData {
  contacts: [{ type: string; value: string }]
}
const ajvSchema: AsyncSchema = {
  $async: true,
  type: 'object',
  properties: {
    contacts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', nullable: false },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
    },
  },
  required: ['contacts'],
  additionalProperties: false,
}
const ajvValidator = ajv.compile<AjvData>(ajvSchema)

console.log('======================')
console.log('Benchmarking arrays')
console.log('======================')

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
  .run({ async: true })
