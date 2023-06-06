/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CompilerNodes, ObjectNode, RefsStore } from '@vinejs/compiler/types'

import { BaseType } from './base.js'
import { ObjectGroup } from './object/group.js'
import { BRAND, CBRAND, PARSE } from '../symbols.js'
import { GroupConditional } from './object/conditional.js'
import type { ParserOptions, ConstructableSchema, SchemaTypes } from '../types.js'

/**
 * Converts schema properties to camelCase
 */
export class VineCamelCaseRoot<Schema extends SchemaTypes>
  implements ConstructableSchema<Schema[typeof CBRAND], Schema[typeof CBRAND]>
{
  declare [BRAND]: Schema[typeof CBRAND];
  declare [CBRAND]: Schema[typeof CBRAND]
  #schema: Schema

  constructor(schema: Schema) {
    this.#schema = schema
  }

  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    options.toCamelCase = true
    return this.#schema[PARSE](propertyName, refs, options)
  }
}

/**
 * VineRoot is similar to VineObject with minor differences in the API that
 * are applicable to a root level object.
 */
export class VineRoot<
  Properties extends Record<string, SchemaTypes>,
  Output,
  CamelCaseOutput
> extends BaseType<Output, CamelCaseOutput> {
  /**
   * Object properties
   */
  #properties: Properties

  /**
   * Object groups to merge based on conditionals
   */
  #groups: ObjectGroup<GroupConditional<any, any, any>>[] = []

  /**
   * Whether or not to allow unknown properties
   */
  #allowUnknownProperties: boolean = false

  constructor(properties: Properties) {
    super()
    this.#properties = properties
  }

  /**
   * Copy unknown properties to the final output.
   */
  allowUnknownProperties<Value>(): VineRoot<
    Properties,
    Output & { [K: string]: Value },
    CamelCaseOutput & { [K: string]: Value }
  > {
    this.#allowUnknownProperties = true
    return this as VineRoot<
      Properties,
      Output & { [K: string]: Value },
      CamelCaseOutput & { [K: string]: Value }
    >
  }

  /**
   * Applies camelcase transform
   */
  toCamelCase() {
    return new VineCamelCaseRoot(this)
  }

  /**
   * Compiles the schema type to a compiler node
   */
  [PARSE](_: string, refs: RefsStore, options: ParserOptions): ObjectNode {
    return {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      allowUnknownProperties: this.#allowUnknownProperties,
      validations: this.compileValidations(refs),
      properties: Object.keys(this.#properties).map((property) => {
        return this.#properties[property][PARSE](property, refs, options)
      }),
      groups: this.#groups.map((group) => group[PARSE](refs, options)),
    }
  }

  /**
   * Merge a union to the object groups. The union can be a "vine.union"
   * with objects, or a "vine.object.union" with properties.
   */
  merge<Group extends ObjectGroup<GroupConditional<any, any, any>>>(
    group: Group
  ): VineRoot<Properties, Output & Group[typeof BRAND], CamelCaseOutput & Group[typeof CBRAND]> {
    this.#groups.push(group)
    return this as VineRoot<
      Properties,
      Output & Group[typeof BRAND],
      CamelCaseOutput & Group[typeof CBRAND]
    >
  }
}
