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
import { type CamelCase } from './camelcase_types.js'
import { VineOptional } from './optional/main.js'
import { VineAccepted } from './accepted/main.js'
import { group } from './object/group_builder.js'
import { VineNativeEnum } from './enum/native_enum.js'
import { VineNativeFile } from './native_file/main.js'
import { VineUnionOfTypes } from './union_of_types/main.js'
import { type ITYPE, type OTYPE, type COTYPE, IS_OF_TYPE, UNIQUE_NAME } from '../symbols.js'
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
   * Define a sub-object as a conditional union group.
   * Groups allow creating conditional validations based on discriminator fields.
   *
   * @example
   * vine.group([
   *   vine.group.if(vine.string(), vine.object({ name: vine.string() }))
   * ])
   */
  group = group

  /**
   * Define a union of multiple schema types.
   * Union schemas attempt to validate against each schema until one succeeds.
   *
   * @example
   * vine.union([
   *   vine.string(),
   *   vine.number()
   * ])
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
   * Define a schema type that validates input matches a specific literal value.
   * Useful for validating exact strings, numbers, or boolean values.
   *
   * @template Value - The literal value type to validate against
   * @param value - The exact value that input must match
   * @returns A VineLiteral schema instance
   *
   * @example
   * vine.literal('hello') // Only accepts "hello"
   * vine.literal(42)      // Only accepts 42
   * vine.literal(true)    // Only accepts true
   */
  literal<const Value extends Literal>(value: Value) {
    return new VineLiteral<Value>(value)
  }

  /**
   * Define an optional value that can be undefined.
   * Chain the "nullable" method to also allow null values in the output.
   *
   * @returns A VineOptional schema instance
   *
   * @example
   * vine.optional() // Accepts undefined
   * vine.optional().nullable() // Accepts undefined or null
   */
  optional() {
    return new VineOptional<undefined>()
  }

  /**
   * Define a schema that only accepts null values.
   *
   * @returns A VineNull schema instance
   *
   * @example
   * vine.null() // Only accepts null
   */
  null() {
    return new VineNull()
  }

  /**
   * Define an object schema with known properties and their validation schemas.
   * You may call "allowUnknownProperties" to merge unknown properties into the output.
   *
   * @template Properties - Record of property names to their schema types
   * @param properties - Object defining the schema for each property
   * @returns A VineObject schema instance
   *
   * @example
   * vine.object({
   *   name: vine.string().minLength(2),
   *   age: vine.number().min(0),
   *   email: vine.string().email().optional()
   * })
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
   * Define an array schema that validates each element against a given schema.
   * All elements in the array must conform to the same schema type.
   *
   * @template Schema - The schema type for validating array elements
   * @param schema - The schema to validate each array element against
   * @returns A VineArray schema instance
   *
   * @example
   * vine.array(vine.string()) // Array of strings
   * vine.array(vine.object({ id: vine.number() })) // Array of objects
   */
  array<Schema extends SchemaTypes>(schema: Schema) {
    return new VineArray<Schema>(schema)
  }

  /**
   * Define a tuple schema with fixed length where each element
   * can have its own validation schema.
   *
   * @template Schema - Array of schema types for each tuple position
   * @param schemas - Array of schemas for each tuple element
   * @returns A VineTuple schema instance
   *
   * @example
   * vine.tuple([
   *   vine.string(),   // First element must be string
   *   vine.number(),   // Second element must be number
   *   vine.boolean()   // Third element must be boolean
   * ])
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
   * Define a record (dictionary) schema with unknown string keys
   * and values that conform to a specific schema type.
   *
   * @template Schema - The schema type for validating record values
   * @param schema - The schema to validate each record value against
   * @returns A VineRecord schema instance
   *
   * @example
   * vine.record(vine.string()) // { [key: string]: string }
   * vine.record(vine.number()) // { [key: string]: number }
   */
  record<Schema extends SchemaTypes>(schema: Schema) {
    return new VineRecord<Schema>(schema)
  }

  /**
   * Define an enum schema that validates input against a predefined set of choices.
   * Supports both array-based enums and TypeScript native enums.
   *
   * @template Values - The enum values type (array or enum-like object)
   * @param values - Array of allowed values, function returning values, or TypeScript enum
   * @returns VineEnum or VineNativeEnum schema instance
   *
   * @example
   * // Array-based enum
   * vine.enum(['red', 'green', 'blue'])
   *
   * // Dynamic enum with function
   * vine.enum((field) => getUserRoles(field.meta.userId))
   *
   * // TypeScript enum
   * enum Status { ACTIVE = 'active', INACTIVE = 'inactive' }
   * vine.enum(Status)
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
   * Define a schema that accepts any value without validation.
   * Use sparingly as it bypasses type safety and validation.
   *
   * @returns A VineAny schema instance
   *
   * @example
   * vine.any() // Accepts any value: string, number, object, etc.
   */
  any() {
    return new VineAny()
  }

  /**
   * Define a union of unique schema types with intelligent type discrimination.
   * Unlike regular unions, this validates against the most specific matching schema
   * using runtime type checking.
   *
   * @template Schema - The schema types in the union
   * @param schemas - Array of distinct schema types for the union
   * @returns A VineUnionOfTypes schema instance
   * @throws {Error} When schemas are not compatible or duplicated
   *
   * @example
   * vine.unionOfTypes([
   *   vine.string(),
   *   vine.number(),
   *   vine.boolean()
   * ])
   *
   * // For objects with discriminator fields
   * vine.unionOfTypes([
   *   vine.object({ type: vine.literal('user'), name: vine.string() }),
   *   vine.object({ type: vine.literal('admin'), permissions: vine.array(vine.string()) })
   * ])
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
   * Define a schema that validates native File instances.
   * Useful for file upload validation in web applications.
   *
   * @returns A VineNativeFile schema instance
   *
   * @example
   * vine.nativeFile()
   *   .sizeLimit({ size: '2mb' })
   *   .extnames(['jpg', 'png', 'gif'])
   */
  nativeFile() {
    return new VineNativeFile()
  }
}
