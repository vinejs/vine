/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, RecordNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import { BRAND, CBRAND, PARSE } from '../../symbols.js'
import { FieldOptions, ParserOptions, SchemaTypes, Validation } from '../../types.js'

/**
 * VineRecord represents an object of key-value pair in which
 * keys are unknown
 */
export class VineRecord<Schema extends SchemaTypes> extends BaseType<
  { [K: string]: Schema[typeof BRAND] },
  { [K: string]: Schema[typeof CBRAND] }
> {
  #schema: Schema

  constructor(schema: Schema, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schema = schema
  }

  /**
   * Clones the VineRecord schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineRecord(
      this.#schema.clone(),
      this.cloneOptions(),
      this.cloneValidations()
    ) as this
  }

  /**
   * Compiles to array data type
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): RecordNode {
    return {
      type: 'record',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      each: this.#schema[PARSE]('*', refs, options),
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}
