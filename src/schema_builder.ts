/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CamelCase } from 'type-fest'
import Macroable from '@poppinss/macroable'
import { FieldContext } from '@vinejs/compiler/types'

import type { EnumLike, SchemaTypes } from './types.js'
import { VineRoot } from './schema_types/root.js'
import { VineTuple } from './schema_types/tuple/main.js'
import { VineUnion } from './schema_types/union/main.js'
import { VineArray } from './schema_types/array/main.js'
import { VineObject } from './schema_types/object/main.js'
import { ObjectGroup } from './schema_types/object/group.js'
import { VineString } from './schema_types/literal/string.js'
import { VineLiteral } from './schema_types/literal/literal.js'
import { VineBoolean } from './schema_types/literal/boolean.js'
import { GroupConditional } from './schema_types/object/conditional.js'
import { UnionConditional } from './schema_types/union/conditional.js'
import { BRAND, CBRAND } from './symbols.js'
import { VineRecord } from './schema_types/record/main.js'
import { VineEnum } from './schema_types/literal/enum.js'
import { VineNativeEnum } from './schema_types/literal/native_enum.js'

/**
 * Create an object group. Groups are used to conditionally merge properties
 * to an existing object.
 */
function group<Conditional extends GroupConditional<any, any, any>>(conditionals: Conditional[]) {
  return new ObjectGroup<Conditional>(conditionals)
}

/**
 * Wrap object properties inside a conditonal
 */
group.if = function groupIf<Properties extends Record<string, SchemaTypes>>(
  conditon: (value: Record<string, unknown>, ctx: FieldContext) => any,
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    {
      [K in keyof Properties]: Properties[K][typeof BRAND]
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof CBRAND]
    }
  >(conditon, properties)
}

/**
 * Wrap object properties inside an else conditon
 */
group.else = function groupElse<Properties extends Record<string, SchemaTypes>>(
  properties: Properties
) {
  return new GroupConditional<
    Properties,
    {
      [K in keyof Properties]: Properties[K][typeof BRAND]
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K][typeof CBRAND]
    }
  >(() => true, properties)
}

function union<Conditional extends UnionConditional<any>>(conditionals: Conditional[]) {
  return new VineUnion<Conditional>(conditionals)
}

/**
 * Wrap object properties inside a conditonal
 */
union.if = function unionIf<Schema extends SchemaTypes>(
  conditon: (value: Record<string, unknown>, ctx: FieldContext) => any,
  schema: Schema
) {
  return new UnionConditional<Schema>(conditon, schema)
}

/**
 * Wrap object properties inside an else conditon
 */
union.else = function unionElse<Schema extends SchemaTypes>(schema: Schema) {
  return new UnionConditional<Schema>(() => true, schema)
}

/**
 * Schema builder exposes API to construct a schema
 */
export class SchemaBuilder extends Macroable {
  group = group
  union = union

  /**
   * Create a string schema type
   */
  string() {
    return new VineString()
  }

  /**
   * Create a boolean schema type
   */
  boolean() {
    return new VineBoolean()
  }

  /**
   * Create a schema type that matches the exact
   * given value
   */
  literal<const Value>(value: Value) {
    return new VineLiteral<Value>(value)
  }

  /**
   * Create an object schema type
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
   * Initiate schema
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

  array<Schema extends SchemaTypes>(schema: Schema) {
    return new VineArray<Schema>(schema)
  }

  tuple<Schema extends SchemaTypes[]>(schemas: [...Schema]) {
    return new VineTuple<
      Schema,
      { [K in keyof Schema]: Schema[K][typeof BRAND] },
      { [K in keyof Schema]: Schema[K][typeof CBRAND] }
    >(schemas)
  }

  record<Schema extends SchemaTypes>(schema: Schema) {
    return new VineRecord<Schema>(schema)
  }

  enum<const Values extends readonly unknown[]>(values: Values): VineEnum<Values>
  enum<Values extends EnumLike>(values: Values): VineNativeEnum<Values>
  enum<Values extends readonly unknown[] | EnumLike>(values: Values): any {
    if (Array.isArray(values)) {
      return new VineEnum(values)
    }
    return new VineNativeEnum(values as EnumLike)
  }
}
