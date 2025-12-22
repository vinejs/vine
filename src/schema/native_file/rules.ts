/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { messages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

/**
 * Validates the value to be an instance of the platform native File
 * class
 */
export const isNativeFileRule = createRule(function file(value, _, field): boolean {
  if (!field.isDefined) {
    return false
  }

  if (value instanceof File === false) {
    field.report(messages.nativeFile, 'nativeFile', field)
    return false
  }

  return true
})

/**
 * Enforce the file size to be atleast the provided minimum size
 */
export const minSizeRule = createRule<{ min: number }>(function minSize(value, options, field) {
  if ((value as File).size < options.min) {
    field.report(messages['nativeFile.minSize'], 'nativeFile.minSize', field, options)
    return false
  }

  return true
})

/**
 * Limit the maximum file size
 */
export const maxSizeRule = createRule<{ max: number }>(function minSize(value, options, field) {
  if ((value as File).size > options.max) {
    field.report(messages['nativeFile.maxSize'], 'nativeFile.maxSize', field, options)
  }
})

/**
 * Enforce the file type to be one of the specified file types
 */
export const mimeTypesRule = createRule<{ mimeTypes: string[] }>((value, options, field) => {
  const mimeType = (value as File).type
  if (!options.mimeTypes.includes(mimeType)) {
    field.report(messages['nativeFile.mimeTypes'], 'nativeFile.mimeTypes', field, options)
  }
})
