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
import { union } from './union/builder.js'
import { VineTuple } from './tuple/main.js'
import { VineArray } from './array/main.js'
import { BRAND, CBRAND } from '../symbols.js'
import { VineObject } from './object/main.js'
import { VineRecord } from './record/main.js'
import { VineString } from './string/main.js'
import { VineNumber } from './number/main.js'
import { VineBoolean } from './boolean/main.js'
import { VineLiteral } from './literal/main.js'
import { CamelCase } from './camelcase_types.js'
import { VineAccepted } from './accepted/main.js'
import { group } from './object/group_builder.js'
import { VineNativeEnum } from './enum/native_enum.js'
import type { EnumLike, FieldContext, SchemaTypes } from '../types.js'

/**
 * Schema builder exposes methods to construct a Vine schema. You may
 * add custom methods to it using macros.
 */
export class SchemaBuilder extends Macroable {
  /**
   * Define a sub-object as a union
   */
  group = group

  /**
   * Define a union value
   */
  union = union

  /**
   * Define a string value
   */
  string() {
    return new VineString()
  }

  /**
   * Define a boolean value
   */
  boolean(options?: { strict: boolean }) {
    return new VineBoolean(options)
  }

  /**
   * Validate a checkbox to be checked
   */
  accepted() {
    return new VineAccepted()
  }

  /**
   * Define a number value
   */
  number() {
    return new VineNumber()
  }

  /**
   * Define a schema type in which the input value
   * matches the pre-defined value
   */
  literal<const Value>(value: Value) {
    return new VineLiteral<Value>(value)
  }

  /**
   * Define an object with known properties. You may call "allowUnknownProperties"
   * to merge unknown properties.
   */
  object<Properties extends Record<string, SchemaTypes>>(properties: Properties) {
    return new VineObject<
      Properties,
      {
        [K in keyof Properties]: Properties[K][typeof BRAND]
      },
      {
        [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof CBRAND]
      }
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
      { [K in keyof Schema]: Schema[K][typeof BRAND] },
      { [K in keyof Schema]: Schema[K][typeof CBRAND] }
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
    values: Values | ((ctx: FieldContext) => Values)
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
}
