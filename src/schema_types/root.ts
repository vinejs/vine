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
import { GroupConditional } from './object/conditional.js'
import type { ConstructableSchema, SchemaTypes, Transformer } from '../types.js'

export class VineCamelCaseRoot<Schema extends SchemaTypes>
  implements ConstructableSchema<Schema['__camelCaseBrand'], Schema['__camelCaseBrand']>
{
  declare __brand: Schema['__camelCaseBrand']
  declare __camelCaseBrand: Schema['__camelCaseBrand']
  #schema: Schema

  constructor(schema: Schema) {
    this.#schema = schema
  }

  compile(
    propertyName: string,
    refs: RefsStore,
    transform?: Transformer<any, any> | undefined
  ): CompilerNodes {
    return this.#schema.compile(propertyName, refs, transform)
  }
}

/**
 * VineRoot is a superset of VineObject with some additional APIs
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
  compile(_: string, refs: RefsStore): ObjectNode {
    return {
      type: 'object',
      fieldName: '*',
      propertyName: '*',
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
  ): VineRoot<Properties, Output & Group['__brand'], CamelCaseOutput & Group['__camelCaseBrand']> {
    this.#groups.push(group)
    return this as VineRoot<
      Properties,
      Output & Group['__brand'],
      CamelCaseOutput & Group['__camelCaseBrand']
    >
  }
}
