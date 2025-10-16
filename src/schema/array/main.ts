/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, ArrayNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import { ITYPE, OTYPE, COTYPE, PARSE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import type { FieldOptions, ParserOptions, SchemaTypes, Validation } from '../../types.js'

import {
  compactRule,
  notEmptyRule,
  distinctRule,
  minLengthRule,
  maxLengthRule,
  fixedLengthRule,
} from './rules.js'

/**
 * VineArray represents an array schema type in the validation pipeline.
 * It validates arrays and their elements using a nested schema, with support
 * for length constraints, uniqueness checks, and element filtering.
 *
 * @template Schema - The schema type for validating array elements
 *
 * @example
 * const schema = vine.array(vine.string().email())
 *   .minLength(1)
 *   .maxLength(10)
 *   .distinct()
 *
 * const result = await vine.validate({
 *   schema,
 *   data: ['user1@example.com', 'user2@example.com']
 * })
 */
export class VineArray<Schema extends SchemaTypes> extends BaseType<
  Schema[typeof ITYPE][],
  Schema[typeof OTYPE][],
  Schema[typeof COTYPE][]
> {
  /**
   * Static collection of all available validation rules for arrays
   */
  static rules = {
    compact: compactRule,
    notEmpty: notEmptyRule,
    distinct: distinctRule,
    minLength: minLengthRule,
    maxLength: maxLengthRule,
    fixedLength: fixedLengthRule,
  }

  /**
   * The schema used to validate each element in the array
   */
  #schema: Schema;

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
   * Creates a new VineArray instance with element schema and optional configuration.
   *
   * @param schema - The schema to validate each array element
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(schema: Schema, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schema = schema
  }

  /**
   * Enforce a minimum length on an array field.
   *
   * @param expectedLength - The minimum required number of elements
   * @returns This array schema instance for method chaining
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum length on an array field.
   *
   * @param expectedLength - The maximum allowed number of elements
   * @returns This array schema instance for method chaining
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce a fixed length on an array field.
   *
   * @param expectedLength - The exact required number of elements
   * @returns This array schema instance for method chaining
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Ensure the array is not empty.
   *
   * @returns This array schema instance for method chaining
   */
  notEmpty() {
    return this.use(notEmptyRule())
  }

  /**
   * Ensure array elements are distinct/unique.
   *
   * @param fields - Optional field names to check for uniqueness in object arrays
   * @returns This array schema instance for method chaining
   */
  distinct(fields?: string | string[]) {
    return this.use(distinctRule({ fields }))
  }

  /**
   * Removes empty strings, null and undefined values from the array.
   *
   * @returns This array schema instance for method chaining
   */
  compact() {
    return this.use(compactRule())
  }

  /**
   * Clones the VineArray schema type. The applied options
   * and validations are copied to the new instance.
   *
   * @returns A cloned instance of this VineArray schema
   */
  clone(): this {
    return new VineArray(this.#schema.clone(), this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Compiles to array data type for the validation compiler.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled array node for validation
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): ArrayNode {
    return {
      type: 'array',
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
