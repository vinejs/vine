/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import type { ObjectNode, RefsStore } from '@vinejs/compiler/types'

import { BaseType } from '../base.js'
import { ObjectGroup } from './group.js'
import { GroupConditional } from './conditional.js'
import { BRAND, CBRAND, PARSE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes } from '../../types.js'

/**
 * VineObject represents an object value in the validation
 * schema.
 */
export class VineObject<
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
  allowUnknownProperties<Value>(): VineObject<
    Properties,
    Output & { [K: string]: Value },
    CamelCaseOutput & { [K: string]: Value }
  > {
    this.#allowUnknownProperties = true
    return this as VineObject<
      Properties,
      Output & { [K: string]: Value },
      CamelCaseOutput & { [K: string]: Value }
    >
  }

  /**
   * Compiles the schema type to a compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): ObjectNode {
    return {
      type: 'object',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      allowUnknownProperties: this.#allowUnknownProperties,
      validations: this.compileValidations(refs),
      properties: Object.keys(this.#properties).map((property) => {
        return this.#properties[property][PARSE](property, refs, options)
      }),
      groups: this.#groups.map((group) => {
        return group[PARSE](refs, options)
      }),
    }
  }

  /**
   * Merge a union to the object groups. The union can be a "vine.union"
   * with objects, or a "vine.object.union" with properties.
   */
  merge<Group extends ObjectGroup<GroupConditional<any, any, any>>>(
    group: Group
  ): VineObject<Properties, Output & Group[typeof BRAND], CamelCaseOutput & Group[typeof CBRAND]> {
    this.#groups.push(group)
    return this as VineObject<
      Properties,
      Output & Group[typeof BRAND],
      CamelCaseOutput & Group[typeof CBRAND]
    >
  }
}
