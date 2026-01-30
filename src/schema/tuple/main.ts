/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { type RefsStore, type TupleNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import { IS_OF_TYPE, PARSE, UNIQUE_NAME } from '../../symbols.js'
import type {
  FieldOptions,
  ParserOptions,
  SchemaTypes,
  Validation,
  WithJSONSchema,
} from '../../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineTuple is an array with known length and may have different
 * schema type for each array element.
 */
export class VineTuple<
  Schema extends SchemaTypes[],
  Input extends any[],
  Output extends any[],
  CamelCaseOutput extends any[],
>
  extends BaseType<Input, Output, CamelCaseOutput>
  implements WithJSONSchema
{
  #schemas: [...Schema]

  /**
   * Whether or not to allow unknown properties
   */
  #allowUnknownProperties: boolean = false;

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.array';

  /**
   * Checks if the value is of array type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return Array.isArray(value)
  }

  constructor(schemas: [...Schema], options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schemas = schemas
  }

  /**
   * Copy unknown properties to the final output.
   */
  allowUnknownProperties<Value>(): VineTuple<
    Schema,
    [...Input, ...Value[]],
    [...Output, ...Value[]],
    [...CamelCaseOutput, ...Value[]]
  > {
    this.#allowUnknownProperties = true
    return this as unknown as VineTuple<
      Schema,
      [...Input, ...Value[]],
      [...Output, ...Value[]],
      [...CamelCaseOutput, ...Value[]]
    >
  }

  /**
   * Clone object
   */
  clone(): this {
    const cloned = new VineTuple<Schema, Input, Output, CamelCaseOutput>(
      this.#schemas.map((schema) => schema.clone()) as Schema,
      this.cloneOptions(),
      this.cloneValidations()
    )

    if (this.#allowUnknownProperties) {
      cloned.allowUnknownProperties()
    }

    return cloned as this
  }

  /**
   * Transforms into JSONSchema.
   */
  toJSONSchema() {
    const items: JSONSchema7[] = []
    for (const item of this.#schemas) {
      if (!item.toJSONSchema) continue
      items.push(item.toJSONSchema())
    }

    const schema: JSONSchema7 = {
      type: 'array',
      minItems: this.#schemas.length,
      maxItems: this.#schemas.length,
      additionalItems: false,
      // Items should NEVER be a list of empty items according to standard
      items: items.length > 0 ? items : undefined,
    }

    for (const validation of this.validations) {
      if (!validation.rule.toJSONSchema) continue
      validation.rule.toJSONSchema(schema, validation.options)
    }

    return schema
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
