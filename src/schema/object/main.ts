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
import { BaseType } from '../base/main.js'
import { GroupConditional } from './conditional.js'
import { OTYPE, COTYPE, PARSE, UNIQUE_NAME, IS_OF_TYPE, ITYPE } from '../../symbols.js'
import type { Validation, SchemaTypes, FieldOptions, ParserOptions } from '../../types.js'

/**
 * Converts schema properties to camelCase during validation.
 * This is a wrapper around VineObject that automatically converts
 * property names from snake_case to camelCase in the output.
 *
 * @template Schema - The underlying VineObject schema type
 *
 * @example
 * const schema = vine.object({
 *   first_name: vine.string(),
 *   last_name: vine.string()
 * }).camelCase()
 *
 * // Output will have: { firstName: string, lastName: string }
 */
export class VineCamelCaseObject<Schema extends VineObject<any, any, any, any>> extends BaseType<
  Schema[typeof ITYPE],
  Schema[typeof COTYPE],
  Schema[typeof COTYPE]
> {
  /**
   * Reference to the underlying object schema
   */
  #schema: Schema;

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'types.object';

  /**
   * Type checker function to determine if a value is an object.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is a non-null object and not an array
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  /**
   * Creates a new VineCamelCaseObject instance wrapping the given schema.
   *
   * @param schema - The VineObject schema to wrap with camelCase conversion
   */
  constructor(schema: Schema) {
    super()
    this.#schema = schema
  }

  /**
   * Clone object with camelCase conversion preserved.
   *
   * @returns A cloned instance of this VineCamelCaseObject schema
   */
  clone(): this {
    return new VineCamelCaseObject<Schema>(this.#schema.clone()) as this
  }

  /**
   * Compiles the schema type to a compiler node with camelCase enabled.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled object node with camelCase conversion
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): ObjectNode {
    options.toCamelCase = true
    return this.#schema[PARSE](propertyName, refs, options)
  }
}

/**
 * VineObject represents an object value in the validation schema.
 * It validates objects with predefined properties, supports conditional
 * groups, and provides control over unknown properties.
 *
 * @template Properties - Record of property names to their schema types
 * @template Input - The expected input type for this object
 * @template Output - The output type after validation and transformation
 * @template CamelCaseOutput - The output type with camelCase property names
 *
 * @example
 * const schema = vine.object({
 *   name: vine.string(),
 *   email: vine.string().email(),
 *   age: vine.number().min(0)
 * })
 *
 * const result = await vine.validate({
 *   schema,
 *   data: { name: 'John', email: 'john@example.com', age: 30 }
 * })
 */
export class VineObject<
  Properties extends Record<string, SchemaTypes>,
  Input,
  Output,
  CamelCaseOutput,
> extends BaseType<Input, Output, CamelCaseOutput> {
  /**
   * Object properties mapping property names to their validation schemas
   */
  #properties: Properties

  /**
   * Object groups to merge based on conditionals.
   * These allow adding properties dynamically based on conditions.
   */
  #groups: ObjectGroup<GroupConditional<any, any, any, any>>[] = []

  /**
   * Whether or not to allow unknown properties that are not defined
   * in the schema. When false, unknown properties cause validation errors.
   */
  #allowUnknownProperties: boolean = false;

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.object';

  /**
   * Type checker function to determine if a value is an object.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is a non-null object and not an array
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  constructor(properties: Properties, options?: FieldOptions, validations?: Validation<any>[]) {
    if (!properties) {
      throw new Error(
        'Missing properties for "vine.object". Use an empty object if you do not want to validate any specific fields'
      )
    }
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
   * Returns a clone copy of the cherry picked object properties including
   * only the mentioned properties.
   */
  pick<Keys extends keyof Properties>(keys: Keys[] | readonly Keys[]): Pick<Properties, Keys> {
    const result = {} as Pick<Properties, Keys>
    for (const key of keys) {
      result[key] = this.#properties[key].clone()
    }
    return result
  }

  /**
   * Returns a cloned copy of the cherry picked object properties without
   * the mentioned properties
   */
  omit<Keys extends keyof Properties>(keys: Keys[] | readonly Keys[]): Omit<Properties, Keys> {
    const result = {} as Omit<Properties, Keys>

    for (const key of Object.keys(this.#properties)) {
      if (!keys.includes(key as Keys)) {
        ;(result as any)[key] = this.#properties[key].clone()
      }
    }

    return result
  }

  /**
   * Copy unknown properties to the final output.
   */
  allowUnknownProperties<Value>(): VineObject<
    Properties,
    Input & { [K: string]: Value },
    Output & { [K: string]: Value },
    CamelCaseOutput & { [K: string]: Value }
  > {
    this.#allowUnknownProperties = true
    return this as VineObject<
      Properties,
      Input & { [K: string]: Value },
      Output & { [K: string]: Value },
      CamelCaseOutput & { [K: string]: Value }
    >
  }

  /**
   * Merge a union to the object groups. The union can be a "vine.union"
   * with objects, or a "vine.object.union" with properties.
   */
  merge<Group extends ObjectGroup<GroupConditional<any, any, any, any>>>(
    group: Group
  ): VineObject<
    Properties,
    Input & Group[typeof ITYPE],
    Output & Group[typeof OTYPE],
    CamelCaseOutput & Group[typeof COTYPE]
  > {
    this.#groups.push(group)
    return this as VineObject<
      Properties,
      Input & Group[typeof ITYPE],
      Output & Group[typeof OTYPE],
      CamelCaseOutput & Group[typeof COTYPE]
    >
  }

  /**
   * Clone object
   */
  clone(): this {
    const cloned = new VineObject<Properties, Input, Output, CamelCaseOutput>(
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
