/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ObjectNode, RefsStore } from '@vinejs/compiler/types'

import { ObjectGroup } from './group.js'
import { BaseObjectType } from './base.js'
import type { SchemaTypes } from '../../types.js'
import { GroupConditional } from './conditional.js'

/**
 * VineObject represents an object value in the validation
 * schema.
 */
export class VineObject<
  Properties extends Record<string, SchemaTypes>,
  Output,
  CamelCaseOutput
> extends BaseObjectType<Output, CamelCaseOutput> {
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
  compile(propertyName: string, refs: RefsStore): ObjectNode {
    return {
      type: 'object',
      fieldName: propertyName,
      propertyName: propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      allowUnknownProperties: this.#allowUnknownProperties,
      validations: this.validations.map((validation) => {
        return {
          ruleFnId: refs.track({
            validator: validation.rule.validator,
            options: validation.options,
          }),
          implicit: validation.rule.implicit,
          isAsync: validation.rule.isAsync,
        }
      }),
      properties: Object.keys(this.#properties).map((property) => {
        return this.#properties[property].compile(property, refs)
      }),
      groups: this.#groups.map((group) => {
        return group.compile(refs)
      }),
    }
  }

  /**
   * Merge a union to the object groups. The union can be a "vine.union"
   * with objects, or a "vine.object.union" with properties.
   */
  merge<Group extends ObjectGroup<GroupConditional<any, any, any>>>(
    group: Group
  ): VineObject<
    Properties,
    Output & Group['__brand'],
    CamelCaseOutput & Group['__camelCaseBrand']
  > {
    this.#groups.push(group)
    return this as VineObject<
      Properties,
      Output & Group['__brand'],
      CamelCaseOutput & Group['__camelCaseBrand']
    >
  }
}
