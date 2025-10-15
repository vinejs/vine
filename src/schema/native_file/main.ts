/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SUBTYPE } from '../../symbols.js'
import { BaseLiteralType } from '../base/literal.js'
import { FieldOptions, Validation } from '../../types.js'
import { isNativeFileRule, maxSizeRule, mimeTypesRule, minSizeRule } from './rules.js'

/**
 * VineNativeFile represents a platform native File class instance.
 */
export class VineNativeFile extends BaseLiteralType<File, File, File> {
  [SUBTYPE] = 'file'

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
