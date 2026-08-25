/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { type RefsStore, type RecordNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import {
  type ITYPE,
  type OTYPE,
  type COTYPE,
  PARSE,
  UNIQUE_NAME,
  IS_OF_TYPE,
} from '../../symbols.js'
import type {
  FieldOptions,
  ParserOptions,
  SchemaTypes,
  Validation,
  WithJSONSchema,
} from '../../types.js'
import { fixedLengthRule, maxLengthRule, minLengthRule, validateKeysRule } from './rules.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineRecord represents an object with dynamic keys where all values share the same schema.
 * Unlike VineObject which has predefined properties, records allow any string key
 * but enforce consistent value types across all keys.
 *
 * @template Schema - The schema type for validating all record values
 *
 * @example
 * const schema = vine.record(vine.number())
 *
 * const result = await vine.validate({
 *   schema,
 *   data: { a: 1, b: 2, c: 3 }
 * })
 *
 * @example
 * // Record with complex value types
 * const schema = vine.record(
 *   vine.object({
 *     name: vine.string(),
 *     age: vine.number()
 *   })
 * )
 */
export class VineRecord<Schema extends SchemaTypes>
  extends BaseType<
    { [K: string]: Schema[typeof ITYPE] },
    { [K: string]: Schema[typeof OTYPE] },
    { [K: string]: Schema[typeof COTYPE] }
  >
  implements WithJSONSchema
{
  /**
   * Static collection of all available validation rules for records
   */
  static rules = {
    maxLength: maxLengthRule,
    minLength: minLengthRule,
    fixedLength: fixedLengthRule,
    validateKeys: validateKeysRule,
  }

  /**
   * The schema used to validate each value in the record
   */
  #schema: Schema;

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.object';

  /**
   * Type checker function to determine if a value is an object.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is a non-null object and not an array
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  /**
   * Creates a new VineRecord instance with value schema and optional configuration.
   *
   * @param schema - The schema to validate each record value
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(schema: Schema, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schema = schema
  }

  /**
   * Enforce a minimum number of properties on the record.
   *
   * @param expectedLength - The minimum required number of key-value pairs
   * @returns This record schema instance for method chaining
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum number of properties on the record.
   *
   * @param expectedLength - The maximum allowed number of key-value pairs
   * @returns This record schema instance for method chaining
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce an exact number of properties on the record.
   *
   * @param expectedLength - The exact required number of key-value pairs
   * @returns This record schema instance for method chaining
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Register a custom callback to validate the record's keys.
   * Useful for enforcing key naming patterns or checking key existence.
   *
   * @param args - Arguments to pass to the validateKeys rule
   * @returns This record schema instance for method chaining
   *
   * @example
   * vine.record(vine.string()).validateKeys((keys, field) => {
   *   if (!keys.every(key => /^[a-z_]+$/.test(key))) {
   *     field.report('Keys must be lowercase with underscores', 'invalidKeys', field)
   *   }
   * })
   */
  validateKeys(...args: Parameters<typeof validateKeysRule>) {
    return this.use(validateKeysRule(...args))
  }

  /**
   * Clones the VineRecord schema including the value schema, options, and validations.
   *
   * @returns A cloned instance of this VineRecord schema
   */
  clone(): this {
    return new VineRecord(
      this.#schema.clone(),
      this.cloneOptions(),
      this.cloneValidations()
    ) as this
  }

  /**
   * Converts the record schema to JSON Schema format.
   *
   * @returns JSON Schema representation of this record
   */
  toJSONSchema() {
    const schema = {
      type: 'object',
      additionalProperties: {},
    } satisfies JSONSchema7

    schema.additionalProperties = this.#schema.toJSONSchema?.() ?? {}

    for (const validation of this.validations) {
      if (!validation.rule.toJSONSchema) continue
      validation.rule.toJSONSchema(schema, validation.options)
    }

    return schema
  }

  /**
   * Compiles the record schema to a compiler node for validation.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled record node for validation
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
