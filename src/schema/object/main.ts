/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { type Prettify } from '@poppinss/types'
import type { ObjectNode, RefsStore } from '@vinejs/compiler/types'

import { type ObjectGroup } from './group.js'
import { BaseType } from '../base/main.js'
import { type GroupConditional } from './conditional.js'
import {
  type OTYPE,
  type COTYPE,
  PARSE,
  UNIQUE_NAME,
  IS_OF_TYPE,
  type ITYPE,
} from '../../symbols.js'
import type {
  Validation,
  SchemaTypes,
  FieldOptions,
  ParserOptions,
  PropertiesToOptional,
  UndefinedOptional,
  WithJSONSchema,
} from '../../types.js'
import { type JSONSchema7 } from 'json-schema'
import type { CamelCase } from '../camelcase_types.ts'

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
   * Converts the object schema to JSON Schema format.
   *
   * @returns JSON Schema representation of this object
   */
  toJSONSchema(): JSONSchema7 {
    return this.#schema.toJSONSchema()
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
>
  extends BaseType<Input, Output, CamelCaseOutput>
  implements WithJSONSchema
{
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

  /**
   * Creates a new VineObject instance with property schemas and optional configuration.
   *
   * @param properties - Record of property names to their validation schemas
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   * @throws Error if properties is not provided
   */
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
   * Returns a cloned copy of all object properties with their validation schemas.
   * Note: Object groups are not included to keep implementations simple.
   *
   * @returns Cloned properties record
   *
   * @example
   * const properties = schema.getProperties()
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
   * Returns a cloned subset of object properties containing only the specified keys.
   *
   * @param keys - Array of property keys to include
   * @returns Picked properties record
   *
   * @example
   * const userSchema = vine.object({
   *   name: vine.string(),
   *   email: vine.string().email(),
   *   password: vine.string()
   * })
   *
   * const publicFields = userSchema.pick(['name', 'email'])
   */
  pick<Keys extends keyof Properties>(keys: Keys[] | readonly Keys[]): Pick<Properties, Keys> {
    const result = {} as Pick<Properties, Keys>
    for (const key of keys) {
      result[key] = this.#properties[key].clone()
    }
    return result
  }

  /**
   * Returns a cloned copy of object properties excluding the specified keys.
   *
   * @param keys - Array of property keys to exclude
   * @returns Omitted properties record
   *
   * @example
   * const userSchema = vine.object({
   *   name: vine.string(),
   *   email: vine.string().email(),
   *   password: vine.string()
   * })
   *
   * const withoutPassword = userSchema.omit(['password'])
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
   * Allows unknown properties to pass through validation and be included in the output.
   * By default, objects with properties not defined in the schema will fail validation.
   *
   * @returns This object schema with unknown properties allowed
   *
   * @example
   * const schema = vine.object({
   *   name: vine.string()
   * }).allowUnknownProperties()
   *
   * // Now { name: 'John', extra: 'value' } will pass validation
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
   * Merges conditional property groups into the object schema. Groups allow
   * adding properties dynamically based on runtime conditions.
   *
   * @param group - The conditional group to merge
   * @returns This object schema with the group merged
   *
   * @example
   * const schema = vine.object({
   *   type: vine.string()
   * }).merge(
   *   vine.group([
   *     vine.group.if('type', 'user', { name: vine.string() }),
   *     vine.group.if('type', 'admin', { permissions: vine.array(vine.string()) })
   *   ])
   * )
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
   * Clones the VineObject schema including all properties, validations, groups, and options.
   *
   * @returns A cloned instance of this VineObject schema
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
   * Converts object property names to camelCase in the validation output.
   * Useful when accepting snake_case input but wanting camelCase output.
   *
   * @returns A VineCamelCaseObject wrapper for this schema
   *
   * @example
   * const schema = vine.object({
   *   first_name: vine.string(),
   *   last_name: vine.string()
   * }).toCamelCase()
   *
   * // Output: { firstName: string, lastName: string }
   */
  toCamelCase() {
    return new VineCamelCaseObject(this)
  }

  /**
   * Converts the object schema to JSON Schema format.
   *
   * @returns JSON Schema representation of this object
   */
  toJSONSchema(): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {}
    const required: string[] = []

    for (const [key, property] of Object.entries(this.getProperties())) {
      if (!property.toJSONSchema) {
        continue
      }

      const schema = property.toJSONSchema()
      properties[key] = schema

      if (property.isOptional !== true && property.allowNull !== true) {
        required.push(key)
      }
    }

    const schema: JSONSchema7 = {
      type: 'object',
      properties,
      required,
      additionalProperties: this.#allowUnknownProperties,
    }

    for (const validation of this.validations) {
      if (!validation.rule.toJSONSchema) {
        continue
      }
      validation.rule.toJSONSchema(schema, validation.options)
    }

    if (this.#groups.length > 0) {
      return {
        anyOf: [...this.#groups.map((group) => group.toJSONSchema()), schema],
      }
    }

    return schema
  }

  /**
   * Creates a new object schema with all properties (or specified properties) marked as optional.
   * This is useful for update/PATCH operations where not all fields are required.
   *
   * @param keys - Optional array of property keys to make optional. If omitted, all properties become optional.
   * @returns A new VineObject schema with optional properties
   *
   * @example
   * // Make all properties optional
   * const updateSchema = createSchema.partial()
   *
   * @example
   * // Make only specific properties optional
   * const userSchema = vine.object({
   *   name: vine.string(),
   *   email: vine.string().email(),
   *   age: vine.number()
   * })
   *
   * const updateUserSchema = userSchema.partial(['name', 'age'])
   * // email remains required, name and age become optional
   */
  partial<
    Keys extends keyof Properties = keyof Properties,
    T extends Record<string, SchemaTypes> = Omit<Properties, Keys> &
      PropertiesToOptional<Pick<Properties, Keys>>,
  >(
    keys?: Keys[] | readonly Keys[]
  ): VineObject<
    Prettify<T>,
    UndefinedOptional<{
      [K in keyof T]: T[K][typeof ITYPE]
    }>,
    UndefinedOptional<{
      [K in keyof T]: T[K][typeof OTYPE]
    }>,
    UndefinedOptional<{
      [K in keyof T as CamelCase<K & string>]: T[K][typeof COTYPE]
    }>
  > {
    /**
     * Groups cannot be optional standalone, hence they cannot be marked
     * as optional when merged inside an object. Same is true for
     * unknownProperties.
     */
    if (this.#groups.length > 0 || this.#allowUnknownProperties) {
      throw new Error(
        'toOptional cannot be used on schemas that have groups or allowUnknownProperties enabled'
      )
    }

    const properties: Record<string, SchemaTypes> = {}
    for (const key of Object.keys(this.#properties)) {
      let field = this.#properties[key].clone()

      if (
        (!keys || keys.includes(key as Keys)) &&
        'optional' in field &&
        typeof field.optional === 'function'
      ) {
        field = field.optional()
      }

      properties[key] = field
    }

    return new VineObject(properties, this.cloneOptions(), this.cloneValidations()) as VineObject<
      T,
      UndefinedOptional<{
        [K in keyof T]: T[K][typeof ITYPE]
      }>,
      UndefinedOptional<{
        [K in keyof T]: T[K][typeof OTYPE]
      }>,
      UndefinedOptional<{
        [K in keyof T as CamelCase<K & string>]: T[K][typeof COTYPE]
      }>
    >
  }

  /**
   * Compiles the schema type to a compiler node for validation.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled object node for validation
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
