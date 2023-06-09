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

import { ObjectGroup } from './group.js'
import { GroupConditional } from './conditional.js'
import { BaseModifiersType, BaseType } from '../base/main.js'
import { OTYPE, COTYPE, PARSE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import type { Validation, SchemaTypes, FieldOptions, ParserOptions } from '../../types.js'

/**
 * Converts schema properties to camelCase
 */
export class VineCamelCaseObject<
  Schema extends VineObject<any, any, any>
> extends BaseModifiersType<Schema[typeof COTYPE], Schema[typeof COTYPE]> {
  #schema: Schema;

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'types.object';

  /**
   * Checks if the value is of object type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  constructor(schema: Schema) {
    super()
    this.#schema = schema
  }

  /**
   * Clone object
   */
  clone(): this {
    return new VineCamelCaseObject<Schema>(this.#schema.clone()) as this
  }

  /**
   * Compiles the schema type to a compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): ObjectNode {
    options.toCamelCase = true
    return this.#schema[PARSE](propertyName, refs, options)
  }
}

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
  #allowUnknownProperties: boolean = false;

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.object';

  /**
   * Checks if the value is of object type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  constructor(properties: Properties, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#properties = properties
  }

  /**
   * Returns a clone copy of the object properties. The object groups
   * are not copied to keep the implementations simple and easy to
   * reason about.
   */
  getProperties(): Properties {
    return Object.keys(this.#properties).reduce((result, key) => {
      result[key as keyof Properties] = this.#properties[
        key
      ].clone() as Properties[keyof Properties]
      return result
    }, {} as Properties)
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
   * Merge a union to the object groups. The union can be a "vine.union"
   * with objects, or a "vine.object.union" with properties.
   */
  merge<Group extends ObjectGroup<GroupConditional<any, any, any>>>(
    group: Group
  ): VineObject<Properties, Output & Group[typeof OTYPE], CamelCaseOutput & Group[typeof COTYPE]> {
    this.#groups.push(group)
    return this as VineObject<
      Properties,
      Output & Group[typeof OTYPE],
      CamelCaseOutput & Group[typeof COTYPE]
    >
  }

  /**
   * Clone object
   */
  clone(): this {
    const cloned = new VineObject<Properties, Output, CamelCaseOutput>(
      this.getProperties(),
      this.cloneOptions(),
      this.cloneValidations()
    )

    this.#groups.forEach((group) => cloned.merge(group))
    if (this.#allowUnknownProperties) {
      cloned.allowUnknownProperties()
    }

    return cloned as this
  }

  /**
   * Applies camelcase transform
   */
  toCamelCase() {
    return new VineCamelCaseObject(this)
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
}
