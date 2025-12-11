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
 */
export class VineNativeFile extends BaseLiteralType<File, File, File> {
  /**
   * Static collection of all available validation rules for enums
   */
  static rules = {
    maxSize: maxSizeRule,
    mimeTypes: mimeTypesRule,
    minSize: minSizeRule,
  };

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
   * @returns True if the value is a native file
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value instanceof File
  }

  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isNativeFileRule()
  }

  clone() {
    return new VineNativeFile(this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Enforce the file size to be atleast the provided minimum size
   */
  minSize(size: number) {
    return this.use(minSizeRule({ min: size }))
  }

  /**
   * Limit the maximum file size
   */
  maxSize(size: number) {
    return this.use(maxSizeRule({ max: size }))
  }

  /**
   * Enforce the file type to be one of the specified file types
   */
  mimeTypes(types: string[]) {
    return this.use(mimeTypesRule({ mimeTypes: types }))
  }
}
