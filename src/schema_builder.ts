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

import type { SchemaTypes } from './types.js'
import { VineRoot } from './schema_types/root.js'
import { VineArray } from './schema_types/array/array.js'
import { VineObject } from './schema_types/object/main.js'
import { ObjectGroup } from './schema_types/object/group.js'
import { VineString } from './schema_types/literal/string.js'
import { VineLiteral } from './schema_types/literal/literal.js'
import { VineBoolean } from './schema_types/literal/boolean.js'
import { GroupConditional } from './schema_types/object/conditional.js'
import { VineTuple } from './schema_types/tuple/main.js'

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
      [K in keyof Properties]: Properties[K]['__brand']
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K]['__camelCaseBrand']
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
      [K in keyof Properties]: Properties[K]['__brand']
    },
    {
      [K in keyof Properties as CamelCase<K & string>]: Properties[K]['__camelCaseBrand']
    }
  >(() => true, properties)
}

/**
 * Schema builder exposes API to construct a schema
 */
export class SchemaBuilder extends Macroable {
  group = group

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
        [K in keyof Properties]: Properties[K]['__brand']
      },
      {
        [K in keyof Properties as CamelCase<K & string>]: Properties[K]['__camelCaseBrand']
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
        [K in keyof Properties]: Properties[K]['__brand']
      },
      {
        [K in keyof Properties as CamelCase<K & string>]: Properties[K]['__camelCaseBrand']
      }
    >(properties)
  }

  array<Schema extends SchemaTypes>(schema: Schema) {
    return new VineArray<Schema>(schema)
  }

  tuple<Schema extends SchemaTypes[]>(schemas: [...Schema]) {
    return new VineTuple<
      Schema,
      { [K in keyof Schema]: Schema[K]['__brand'] },
      { [K in keyof Schema]: Schema[K]['__camelCaseBrand'] }
    >(schemas)
  }
}
