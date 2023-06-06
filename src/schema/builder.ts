/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Macroable from '@poppinss/macroable'

import { VineRoot } from './root.js'
import { union } from './union/builder.js'
import { VineTuple } from './tuple/main.js'
import { VineArray } from './array/main.js'
import { VineEnum } from './literal/enum.js'
import { BRAND, CBRAND } from '../symbols.js'
import { VineObject } from './object/main.js'
import { VineRecord } from './record/main.js'
import { VineString } from './literal/string.js'
import { CamelCase } from './camelcase_types.js'
import { group } from './object/group_builder.js'
import { VineBoolean } from './literal/boolean.js'
import { VineLiteral } from './literal/literal.js'
import type { EnumLike, SchemaTypes } from '../types.js'
import { VineNativeEnum } from './literal/native_enum.js'

/**
 * Schema builder exposes methods to construct a Vine schema. You may
 * add custom methods to it using macros.
 */
export class SchemaBuilder extends Macroable {
  group = group
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
  boolean() {
    return new VineBoolean()
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
   * Initiate a root level schema
   */
  schema<Properties extends Record<string, SchemaTypes>>(properties: Properties) {
    return new VineRoot<
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
  enum<const Values extends readonly unknown[]>(values: Values): VineEnum<Values>
  enum<Values extends EnumLike>(values: Values): VineNativeEnum<Values>
  enum<Values extends readonly unknown[] | EnumLike>(values: Values): any {
    if (Array.isArray(values)) {
      return new VineEnum(values)
    }
    return new VineNativeEnum(values as EnumLike)
  }
}
