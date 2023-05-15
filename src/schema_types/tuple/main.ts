/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefsStore, TupleNode } from '@vinejs/compiler/types'
import { SchemaTypes, Transformer } from '../../types.js'
import { BaseTupleType } from './base.js'

export class VineTuple<
  Schema extends SchemaTypes[],
  Output extends any[],
  CamelCaseOutput extends any[]
> extends BaseTupleType<Output, CamelCaseOutput> {
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
  compile(
    propertyName: string,
    refs: RefsStore,
    transform?: Transformer<any, any> | undefined
  ): TupleNode {
    return {
      type: 'tuple',
      allowNull: this.options.allowNull,
      bail: this.options.bail,
      fieldName: propertyName,
      propertyName: propertyName,
      isOptional: this.options.isOptional,
      allowUnknownProperties: this.#allowUnknownProperties,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.validations.map((validation) => {
        return {
          ruleFnId: refs.track({
            validator: validation.rule.validator,
            options: validation.options,
          }),
          implicit: validation.rule.implicit,
          isAsync: validation.rule.isAsync,
        }
      }),
      properties: this.#schemas.map((schema, index) =>
        schema.compile(String(index), refs, transform)
      ),
    }
  }
}
