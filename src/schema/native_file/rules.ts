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
 * Validates that the value is an instance of the platform native File class.
 * This is the primary type validator for native file fields.
 *
 * @example
 * vine.string().use(isNativeFileRule())
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
 * Validates that the file size is at least the specified minimum size in bytes.
 *
 * @example
 * vine.file().use(minSizeRule({ min: 1024 })) // At least 1KB
 *
 * @example
 * vine.file().minSize(1024) // Shorthand method
 */
export const minSizeRule = createRule<{ min: number }>(function minSize(value, options, field) {
  if ((value as File).size < options.min) {
    field.report(messages['nativeFile.minSize'], 'nativeFile.minSize', field, options)
    return false
  }

  return true
})

/**
 * Validates that the file size does not exceed the specified maximum size in bytes.
 *
 * @example
 * vine.file().use(maxSizeRule({ max: 2097152 })) // Max 2MB
 *
 * @example
 * vine.file().maxSize(2097152) // Shorthand method
 */
export const maxSizeRule = createRule<{ max: number }>(function minSize(value, options, field) {
  if ((value as File).size > options.max) {
    field.report(messages['nativeFile.maxSize'], 'nativeFile.maxSize', field, options)
  }
})

/**
 * Validates that the file's MIME type is one of the allowed types.
 *
 * @example
 * vine.file().use(mimeTypesRule({
 *   mimeTypes: ['image/jpeg', 'image/png']
 * }))
 *
 * @example
 * vine.file().mimeTypes(['image/jpeg', 'image/png']) // Shorthand method
 */
export const mimeTypesRule = createRule<{ mimeTypes: string[] }>((value, options, field) => {
  const mimeType = (value as File).type
  if (!options.mimeTypes.includes(mimeType)) {
    field.report(messages['nativeFile.mimeTypes'], 'nativeFile.mimeTypes', field, options)
  }
})
