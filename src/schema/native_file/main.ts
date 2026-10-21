/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IS_OF_TYPE, SUBTYPE, UNIQUE_NAME } from '../../symbols.js'
import { BaseLiteralType } from '../base/literal.js'
import { type FieldOptions, type Validation } from '../../types.js'
import { isNativeFileRule, maxSizeRule, mimeTypesRule, minSizeRule } from './rules.js'

/**
 * VineNativeFile represents a platform native File class instance.
 * This type is used to validate file uploads in browser environments
 * where the File API is available.
 *
 * The file is validated based on type, size, and MIME type constraints.
 * Unlike MultipartFile (used in Node.js), this works with the browser's
 * native File object from file input elements.
 *
 * @example
 * const schema = vine.object({
 *   avatar: vine.file().maxSize('2mb').mimeTypes(['image/jpeg', 'image/png']),
 *   document: vine.file().minSize('1kb').maxSize('10mb')
 * })
 *
 * @example
 * // From HTML file input
 * // <input type="file" name="avatar" />
 * const file = event.target.files[0] // This is a native File instance
 */
export class VineNativeFile extends BaseLiteralType<File, File, File> {
  /**
   * Static collection of all available validation rules for native files
   */
  static rules = {
    maxSize: maxSizeRule,
    mimeTypes: mimeTypesRule,
    minSize: minSizeRule,
  };

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE] = 'nativeFile';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.nativeFile';

  /**
   * Type checker function to determine if a value is a native file.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value instanceof File
  }

  /**
   * Creates a new VineNativeFile instance.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isNativeFileRule()
  }

  /**
   * Clones the VineNativeFile schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineNativeFile schema
   */
  clone() {
    return new VineNativeFile(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Enforce the file size to be at least the provided minimum size.
   *
   * @param size - Minimum file size in bytes
   *
   * @example
   * vine.file().minSize(1024) // At least 1KB
   */
  minSize(size: number) {
    return this.use(minSizeRule({ min: size }))
  }

  /**
   * Limit the maximum file size.
   *
   * @param size - Maximum file size in bytes
   *
   * @example
   * vine.file().maxSize(2097152) // Max 2MB
   */
  maxSize(size: number) {
    return this.use(maxSizeRule({ max: size }))
  }

  /**
   * Enforce the file type to be one of the specified MIME types.
   *
   * @param types - Array of allowed MIME types
   *
   * @example
   * vine.file().mimeTypes(['image/jpeg', 'image/png', 'image/gif'])
   *
   * @example
   * vine.file().mimeTypes(['application/pdf'])
   */
  mimeTypes(types: string[]) {
    return this.use(mimeTypesRule({ mimeTypes: types }))
  }
}
