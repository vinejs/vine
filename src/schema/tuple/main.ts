/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, TupleNode } from '@vinejs/compiler/types'

import { BaseType } from '../base.js'
import { PARSE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes } from '../../types.js'

/**
 * VineTuple is an array with known length and may have different
 * schema type for each array element.
 */
export class VineTuple<
  Schema extends SchemaTypes[],
  Output extends any[],
  CamelCaseOutput extends any[]
> extends BaseType<Output, CamelCaseOutput> {
  #schemas: [...Schema]

  /**
   * Whether or not to allow unknown properties
   */
  #allowUnknownProperties: boolean = false

  constructor(schemas: [...Schema]) {
    super()
    this.#schemas = schemas
  }

  /**
   * Copy unknown properties to the final output.
   */
  allowUnknownProperties<Value>(): VineTuple<
    Schema,
    [...Output, ...Value[]],
    [...CamelCaseOutput, ...Value[]]
  > {
    this.#allowUnknownProperties = true
    return this as unknown as VineTuple<
      Schema,
      [...Output, ...Value[]],
      [...CamelCaseOutput, ...Value[]]
    >
  }

  /**
   * Compiles to array data type
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): TupleNode {
    return {
      type: 'tuple',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      allowUnknownProperties: this.#allowUnknownProperties,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
      properties: this.#schemas.map((schema, index) => schema[PARSE](String(index), refs, options)),
    }
  }
}
