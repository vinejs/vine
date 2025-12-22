/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Macroable from '@poppinss/macroable'
import type { RefsStore } from '@vinejs/compiler/types'

import { ITYPE, OTYPE, COTYPE, PARSE, VALIDATION } from '../../symbols.js'
import type {
  Parser,
  Validation,
  RuleBuilder,
  FieldOptions,
  CompilerNodes,
  ParserOptions,
  ConstructableSchema,
  WithCustomRules,
} from '../../types.js'
import { ConditionalValidations } from './conditional_rules.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Modifies the schema type to allow null values in addition to the
 * original schema type. This is useful for optional database fields
 * or API responses that may contain null values.
 *
 * @template Schema - The underlying schema type to modify
 *
 * @example
 * const schema = vine.string().nullable()
 * // Accepts: "hello", null
 * // Rejects: undefined, 123
 */
export class NullableModifier<
  Schema extends ConstructableSchema<any, any, any>,
> implements ConstructableSchema<
  Schema[typeof ITYPE] | null,
  Schema[typeof OTYPE] | null,
  Schema[typeof COTYPE] | null
> {
  /**
   * Define the input type of the schema, including null
   */
  declare [ITYPE]: Schema[typeof ITYPE] | null;

  /**
   * The output value of the field with null support.
   * The property points to a type only and not the real value.
   */
  declare [OTYPE]: Schema[typeof OTYPE] | null;
  declare [COTYPE]: Schema[typeof COTYPE] | null

  /**
   * Reference to the parent schema being modified
   */
  #parent: Schema

  /**
   * Creates a new nullable modifier wrapping the given schema.
   *
   * @param parent - The schema to make nullable
   */
  constructor(parent: Schema) {
    this.#parent = parent
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   *
   * @returns A new OptionalModifier wrapping this nullable schema
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier(this)
  }

  /**
   * Add meta to the field that can be retrieved once compiled.
   * It is also merged with the json-schema.
   */
  meta(meta: JSONSchema7 | Object): MetaModifier<this> {
    return new MetaModifier(this, meta)
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the nullable modifier.
   *
   * @returns A cloned instance of this nullable modifier
   */
  clone(): this {
    return new NullableModifier(this.#parent.clone()) as this
  }

  /**
   * Compiles to compiler node by delegating to the parent schema
   * and setting the allowNull flag.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled compiler node with null support
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)
    if (output.type !== 'union') {
      output.allowNull = true

      // TODO: We might want to dedupe
      if (output.jsonSchema.anyOf) {
        output.jsonSchema.anyOf.push({ type: 'null' })
        return output
      }

      if (output.jsonSchema.type === undefined) {
        output.jsonSchema.type = 'null'
        return output
      }

      if (typeof output.jsonSchema.type === 'string') {
        output.jsonSchema.type = [output.jsonSchema.type, 'null']
        return output
      }

      if (Array.isArray(output.jsonSchema.type)) {
        output.jsonSchema.type.push('null')
        return output
      }
    }

    return output
  }
}

export class MetaModifier<
  Schema extends ConstructableSchema<any, any, any>,
> implements ConstructableSchema<
  Schema[typeof ITYPE],
  Schema[typeof OTYPE],
  Schema[typeof COTYPE]
> {
  /**
   * Define the input type of the schema
   */
  declare [ITYPE]: Schema[typeof ITYPE];

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: Schema[typeof OTYPE];
  declare [COTYPE]: Schema[typeof COTYPE]

  #parent: Schema
  #meta: JSONSchema7 | Object

  constructor(parent: Schema, meta: JSONSchema7 | Object) {
    this.#parent = parent
    this.#meta = meta
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the meta modifier
   */
  clone(): this {
    return new MetaModifier(this.#parent.clone(), this.#meta) as this
  }

  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)

    output.jsonSchema = {
      ...output.jsonSchema,
      ...this.#meta,
    }

    return output
  }
}

/**
 * Modifies the schema type to allow undefined values in addition to the
 * original schema type. This is useful for form fields that may not be
 * present in the submitted data.
 *
 * @template Schema - The underlying schema type to modify
 *
 * @example
 * const schema = vine.string().optional()
 * // Accepts: "hello", undefined
 * // Rejects: null (unless also nullable), 123
 */
export class OptionalModifier<Schema extends ConstructableSchema<any, any, any>>
  extends ConditionalValidations
  implements
    ConstructableSchema<
      Schema[typeof ITYPE] | null | undefined,
      Schema[typeof OTYPE] | undefined,
      Schema[typeof COTYPE] | undefined
    >,
    WithCustomRules
{
  /**
   * Define the input type of the schema, including undefined and null
   */
  declare [ITYPE]: Schema[typeof ITYPE] | undefined | null;

  /**
   * The output value of the field with undefined support.
   * The property points to a type only and not the real value.
   */
  declare [OTYPE]: Schema[typeof OTYPE] | undefined;
  declare [COTYPE]: Schema[typeof COTYPE] | undefined

  /**
   * Reference to the parent schema being modified
   */
  #parent: Schema

  /**
   * List of validations to apply to non-undefined values
   */
  validations: Validation<any>[]

  /**
   * Creates a new optional modifier wrapping the given schema.
   *
   * @param parent - The schema to make optional
   * @param validations - Optional list of validations to apply
   */
  constructor(parent: Schema, validations?: Validation<any>[]) {
    super()
    this.#parent = parent
    this.validations = validations || []
  }

  /**
   * Shallow clones the validations. Since, there are no API's to mutate
   * the validation options, we can safely copy them by reference.
   *
   * @returns Cloned array of validations
   */
  protected cloneValidations(): Validation<any>[] {
    return this.validations.map((validation) => {
      return {
        options: validation.options,
        rule: validation.rule,
      }
    })
  }

  /**
   * Compiles validations into a format suitable for the validator compiler.
   *
   * @param refs - Reference store for tracking validation functions
   * @returns Compiled validation definitions
   */
  protected compileValidations(refs: RefsStore) {
    return this.validations.map((validation) => {
      return {
        ruleFnId: refs.track({
          validator: validation.rule.validator,
          options: validation.options,
        }),
        name: validation.rule.name,
        implicit: validation.rule.implicit,
        isAsync: validation.rule.isAsync,
      }
    })
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   *
   * If `optional` and `nullable` are used together, then both undefined
   * and null values will be allowed.
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier(this)
  }

  /**
   * Add meta to the field that can be retrieved once compiled.
   * It is also merged with the json-schema.
   */
  meta(meta: JSONSchema7 | Object): MetaModifier<this> {
    return new MetaModifier(this, meta)
  }

  /**
   * Push a validation to the validations chain.
   */
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
    return this
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the optional modifier
   */
  clone(): this {
    return new OptionalModifier(this.#parent.clone(), this.cloneValidations()) as this
  }

  /**
   * Compiles to compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)
    if (output.type !== 'union') {
      output.isOptional = true
      output.validations = output.validations.concat(this.compileValidations(refs))
    }

    return output
  }
}

/**
 * The BaseType class abstracts the repetitive parts of creating
 * a custom schema type. It provides common functionality like validation
 * chaining, optional/nullable modifiers, and compilation logic.
 *
 * @template Input - The expected input type for this schema
 * @template Output - The output type after validation and transformation
 * @template CamelCaseOutput - The output type with camelCase field names
 *
 * @example
 * class CustomStringType extends BaseType<string, string, string> {
 *   [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions) {
 *     return { type: 'literal', name: propertyName, ... }
 *   }
 *   clone() { return new CustomStringType() }
 * }
 */
export abstract class BaseType<Input, Output, CamelCaseOutput>
  extends Macroable
  implements ConstructableSchema<Input, Output, CamelCaseOutput>, WithCustomRules
{
  /**
   * Each subtype should implement the compile method that returns
   * one of the known compiler nodes for the validation engine.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled compiler node
   */
  abstract [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes

  /**
   * The child class must implement the clone method to create
   * a deep copy of the schema instance.
   *
   * @returns A cloned instance of this schema
   */
  abstract clone(): this

  /**
   * Define the input type of the schema for TypeScript inference
   */
  declare [ITYPE]: Input;

  /**
   * The output value type of the field after validation.
   * The property points to a type only and not the real value.
   */
  declare [OTYPE]: Output;
  declare [COTYPE]: CamelCaseOutput

  /**
   * Set of validations to run on the field value
   */
  protected validations: Validation<any>[]

  /**
   * Configuration options for this field
   */
  protected options: FieldOptions

  /**
   * Creates a new BaseType instance with optional configuration.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super()
    this.options = options || {
      bail: true,
      allowNull: false,
      isOptional: false,
    }

    this.validations = validations || []
  }

  /**
   * Shallow clones the validations. Since, there are no API's to mutate
   * the validation options, we can safely copy them by reference.
   */
  protected cloneValidations(): Validation<any>[] {
    return this.validations.map((validation) => {
      return {
        options: validation.options,
        rule: validation.rule,
      }
    })
  }

  /**
   * Shallow clones the options
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

  /**
   * Compiles validations
   */
  protected compileValidations(refs: RefsStore) {
    return this.validations.map((validation) => {
      return {
        ruleFnId: refs.track({
          validator: validation.rule.validator,
          options: validation.options,
        }),
        name: validation.rule.name,
        implicit: validation.rule.implicit,
        isAsync: validation.rule.isAsync,
      }
    })
  }

  /**
   * Define a method to parse the input value. The method
   * is invoked before any validation and hence you must
   * perform type-checking to know the value you are working with.
   *
   * @param callback - Parser function to transform the input value
   * @returns This schema instance for method chaining
   *
   * @example
   * vine.string().parse((value) => {
   *   return typeof value === 'string' ? value.trim() : value
   * })
   */
  parse(callback: Parser): this {
    this.options.parse = callback
    return this
  }

  /**
   * Push a validation to the validations chain.
   *
   * @param validation - Validation rule or rule builder to add
   * @returns This schema instance for method chaining
   *
   * @example
   * vine.string().use(vine.createRule((value) => {
   *   return value.length > 0
   * }))
   */
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
    return this
  }

  /**
   * Enable/disable the bail mode. In bail mode, the field validations
   * are stopped after the first error.
   *
   * @param state - Whether to enable bail mode
   * @returns This schema instance for method chaining
   */
  bail(state: boolean) {
    this.options.bail = state
    return this
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   *
   * @returns A new OptionalModifier wrapping this schema
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier(this)
  }

  /**
   * Mark the field under validation to be null. The null value will
   * be written to the output as well.
   *
   * If `optional` and `nullable` are used together, then both undefined
   * and null values will be allowed.
   *
   * @returns A new NullableModifier wrapping this schema
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier(this)
  }

  /**
   * Add meta to the field that can be retrieved once compiled.
   * It is also merged with the json-schema.
   */
  meta(meta: JSONSchema7): MetaModifier<this> {
    return new MetaModifier(this, meta)
  }
}
