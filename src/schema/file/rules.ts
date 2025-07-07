import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

export const isFileRule = createRule((value, _, field) => {
  if (!(value instanceof File)) field.report(messages.file, 'file', field)
})

export const minSizeRule = createRule<{ min: number }>((value, options, field) => {
  if (!(value instanceof File) || !field.isValid) return
  if (value.size < options.min)
    field.report(messages['file.minSize'], 'file.minSize', field, options)
})

export const maxSizeRule = createRule<{ max: number }>((value, options, field) => {
  if (!(value instanceof File) || !field.isValid) return
  if (value.size > options.max)
    field.report(messages['file.maxSize'], 'file.maxSize', field, options)
})

export const mimeTypesRule = createRule<{ mimeTypes: string[] }>((value, options, field) => {
  if (!(value instanceof File) || !field.isValid) return
  const mimeType = value.type
  if (!options.mimeTypes.includes(mimeType))
    field.report(messages['file.mimeTypes'], 'file.mimeTypes', field, options)
})
