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
 * VineTuple represents a fixed-length array where each position has a specific schema type.
 * Unlike VineArray which uses the same schema for all elements, tuples allow different
 * types at different positions, similar to TypeScript tuples.
 *
 * @template Schema - Array of schema types for each tuple position
 * @template Input - Expected input type for the tuple
 * @template Output - Output type after validation and transformation
 * @template CamelCaseOutput - Output type with camelCase property names
 *
 * @example
 * const schema = vine.tuple([
 *   vine.string(),
 *   vine.number(),
 *   vine.boolean()
 * ])
 *
 * const result = await vine.validate({
 *   schema,
 *   data: ['hello', 42, true]
 * })
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
  /**
   * Array of schemas defining the type for each tuple position
   */
  #schemas: [...Schema]

  /**
   * Whether to allow additional elements beyond the defined tuple length
   */
  #allowUnknownProperties: boolean = false;

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.array';

  /**
   * Type checker function to determine if a value is an array.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is an array
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return Array.isArray(value)
  }

  /**
   * Creates a new VineTuple instance with position-specific schemas.
   *
   * @param schemas - Array of schemas defining validation for each tuple position
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(schemas: [...Schema], options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schemas = schemas
  }

  /**
   * Allows additional elements beyond the defined tuple length to pass through validation.
   * By default, tuples enforce exact length matching. This method relaxes that constraint.
   *
   * @returns This tuple schema with unknown properties allowed
   *
   * @example
   * const schema = vine.tuple([
   *   vine.string(),
   *   vine.number()
   * ]).allowUnknownProperties()
   *
   * // Now ['hello', 42, 'extra'] will pass validation
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
   * Clones the VineTuple schema including all position schemas, validations, and options.
   *
   * @returns A cloned instance of this VineTuple schema
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
   * Converts the tuple schema to JSON Schema format.
   *
   * @returns JSON Schema representation of this tuple
   */
  toJSONSchema() {
    const items: JSONSchema7[] = []
    for (const item of this.#schemas) {
      if (!item.toJSONSchema) {
        continue
      }
      items.push(item.toJSONSchema())
    }

    const schema: JSONSchema7 = {
      type: 'array',
      minItems: this.#schemas.length,
      maxItems: this.#schemas.length,
      additionalItems: false,
      items: items,
    }

    for (const validation of this.validations) {
      if (!validation.rule.toJSONSchema) {
        continue
      }
      validation.rule.toJSONSchema(schema, validation.options)
    }

    return schema
  }

  /**
   * Compiles the tuple schema to a compiler node for validation.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled tuple node for validation
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
