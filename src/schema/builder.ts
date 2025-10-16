/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Macroable from '@poppinss/macroable'

import { VineAny } from './any/main.js'
import { VineEnum } from './enum/main.js'
import { VineDate } from './date/main.js'
import { VineNull } from './null/main.js'
import { union } from './union/builder.js'
import { VineTuple } from './tuple/main.js'
import { VineArray } from './array/main.js'
import { VineObject } from './object/main.js'
import { VineRecord } from './record/main.js'
import { VineString } from './string/main.js'
import { VineNumber } from './number/main.js'
import { VineBoolean } from './boolean/main.js'
import { VineLiteral } from './literal/main.js'
import { CamelCase } from './camelcase_types.js'
import { VineOptional } from './optional/main.js'
import { VineAccepted } from './accepted/main.js'
import { group } from './object/group_builder.js'
import { VineNativeEnum } from './enum/native_enum.js'
import { VineNativeFile } from './native_file/main.js'
import { VineUnionOfTypes } from './union_of_types/main.js'
import { ITYPE, OTYPE, COTYPE, IS_OF_TYPE, UNIQUE_NAME } from '../symbols.js'
import type {
  Literal,
  EnumLike,
  SchemaTypes,
  FieldContext,
  UndefinedOptional,
  DateFieldOptions,
} from '../types.js'

/**
 * SchemaBuilder exposes methods to construct Vine validation schemas.
 * It provides a fluent API for creating all supported schema types
 * and can be extended with custom methods using macros.
 *
 * @example
 * const builder = new SchemaBuilder()
 * const schema = builder.object({
 *   name: builder.string(),
 *   age: builder.number().min(0),
 *   email: builder.string().email()
 * })
 */
export class SchemaBuilder extends Macroable {
  /**
   * Define a sub-object as a conditional union group
   */
  group = group

  /**
   * Define a union of multiple schema types
   */
  union = union

  /**
   * Define a string value schema with comprehensive validation rules.
   *
   * @returns A VineString schema instance
   *
   * @example
   * vine.string().email().minLength(5)
   */
  string() {
    return new VineString()
  }

  /**
   * Define a boolean value schema with optional strict mode.
   *
   * @param options - Configuration options for boolean validation
   * @returns A VineBoolean schema instance
   *
   * @example
   * vine.boolean({ strict: true }) // Only accepts true/false
   */
  boolean(options?: { strict: boolean }) {
    return new VineBoolean(options)
  }

  /**
   * Validate a checkbox or acceptance field to be checked/accepted.
   *
   * @returns A VineAccepted schema instance
   *
   * @example
   * vine.accepted() // Validates terms acceptance
   */
  accepted() {
    return new VineAccepted()
  }

  /**
   * Define a number value schema with optional strict mode.
   *
   * @param options - Configuration options for number validation
   * @returns A VineNumber schema instance
   *
   * @example
   * vine.number().min(0).max(100)
   */
  number(options?: { strict: boolean }) {
    return new VineNumber(options)
  }

  /**
   * Define a datetime value schema with optional parsing options.
   *
   * @param options - Configuration options for date validation
   * @returns A VineDate schema instance
   *
   * @example
   * vine.date({ formats: ['YYYY-MM-DD'] })
   */
  date(options?: DateFieldOptions) {
    return new VineDate(options)
  }

  /**
   * Define a schema type in which the input value
   * matches the pre-defined value
   */
  literal<const Value extends Literal>(value: Value) {
    return new VineLiteral<Value>(value)
  }

  /**
   * Define an optional value. Chain the "nullable"
   * method to get null values in the output
   */
  optional() {
    return new VineOptional<undefined>()
  }

  /**
   * Define a null value
   */
  null() {
    return new VineNull()
  }

  /**
   * Define an object with known properties. You may call "allowUnknownProperties"
   * to merge unknown properties.
   */
  object<Properties extends Record<string, SchemaTypes>>(properties: Properties) {
    return new VineObject<
      Properties,
      UndefinedOptional<{
        [K in keyof Properties]: Properties[K][typeof ITYPE]
      }>,
      UndefinedOptional<{
        [K in keyof Properties]: Properties[K][typeof OTYPE]
      }>,
      UndefinedOptional<{
        [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof COTYPE]
      }>
    >(properties)
  }

  /**
   * Define an array field and validate its children elements.
   */
  array<Schema extends SchemaTypes>(schema: Schema) {
    return new VineArray<Schema>(schema)
  }

  /**
   * Define an array field with known length and each children
   * element may have its own schema.
   */
  tuple<Schema extends SchemaTypes[]>(schemas: [...Schema]) {
    return new VineTuple<
      Schema,
      { [K in keyof Schema]: Schema[K][typeof ITYPE] },
      { [K in keyof Schema]: Schema[K][typeof OTYPE] },
      { [K in keyof Schema]: Schema[K][typeof COTYPE] }
    >(schemas)
  }

  /**
   * Define an object field with key-value pair. The keys in
   * a record are unknown and values can be of a specific
   * schema type.
   */
  record<Schema extends SchemaTypes>(schema: Schema) {
    return new VineRecord<Schema>(schema)
  }

  /**
   * Define a field whose value matches the enum choices.
   */
  enum<const Values extends readonly unknown[]>(
    values: Values | ((field: FieldContext) => Values)
  ): VineEnum<Values>
  enum<Values extends EnumLike>(values: Values): VineNativeEnum<Values>
  enum<Values extends readonly unknown[] | EnumLike>(values: Values): any {
    if (Array.isArray(values) || typeof values === 'function') {
      return new VineEnum(values)
    }
    return new VineNativeEnum(values as EnumLike)
  }

  /**
   * Allow the field value to be anything
   */
  any() {
    return new VineAny()
  }

  /**
   * Define a union of unique schema types.
   */
  unionOfTypes<Schema extends SchemaTypes>(schemas: Schema[]) {
    const schemasInUse: Set<string> = new Set()
    schemas.forEach((schema) => {
      if (!schema[IS_OF_TYPE] || !schema[UNIQUE_NAME]) {
        throw new Error(
          `Cannot use "${schema.constructor.name}". The schema type is not compatible for use with "vine.unionOfTypes"`
        )
      }

      if (schemasInUse.has(schema[UNIQUE_NAME])) {
        throw new Error(
          `Cannot use duplicate schema "${schema[UNIQUE_NAME]}". "vine.unionOfTypes" needs distinct schema types only`
        )
      }

      schemasInUse.add(schema[UNIQUE_NAME])
    })
    schemasInUse.clear()
    return new VineUnionOfTypes(schemas)
  }

  /**
   * Define a File instance value
   */
  nativeFile() {
    return new VineNativeFile()
  }
}
