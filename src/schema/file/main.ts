/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SUBTYPE } from '../../symbols.js'
import { FieldOptions, Validation } from '../../types.js'
import { BaseLiteralType } from '../base/literal.js'
import { isFileRule, maxSizeRule, mimeTypesRule, minSizeRule } from './rules.js'

export class VineFile extends BaseLiteralType<File, File, File> {
  [SUBTYPE] = 'File'

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [isFileRule()])
  }

  clone() {
    return new VineFile(this.cloneOptions(), this.cloneValidations()) as this
  }

  minSize(size: number) {
    return this.use(minSizeRule({ min: size }))
  }

  maxSize(size: number) {
    return this.use(maxSizeRule({ max: size }))
  }

  mimeTypes(types: string[]) {
    return this.use(mimeTypesRule({ mimeTypes: types }))
  }
}
