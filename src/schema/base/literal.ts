/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import Macroable from '@poppinss/macroable'
import type { LiteralNode, RefsStore } from '@vinejs/compiler/types'

import { OTYPE, COTYPE, PARSE, VALIDATION, ITYPE, SUBTYPE } from '../../symbols.js'
import type {
  Parser,
  Validation,
  RuleBuilder,
  Transformer,
  FieldOptions,
  ParserOptions,
  ConstructableLiteralSchema,
  WithCustomRules,
} from '../../types.js'
import { ConditionalValidations } from './conditional_rules.js'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends ConstructableLiteralSchema<any, any, any>>
  implements
    ConstructableLiteralSchema<
      Schema[typeof ITYPE] | null,
      Schema[typeof OTYPE] | null,
      Schema[typeof COTYPE] | null
    >
{
  /**
   * Define the input type of the schema
   */
  declare [ITYPE]: Schema[typeof ITYPE] | null;

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: Schema[typeof OTYPE] | null;
  declare [COTYPE]: Schema[typeof COTYPE] | null

  #parent: Schema

  constructor(parent: Schema) {
    this.#parent = parent
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the nullable modifier
   */
  clone(): this {
    return new NullableModifier(this.#parent.clone()) as this
  }

  /**
   * Mark the field under validation as optional.
   * When combined with nullable, allows both null and undefined values.
   *
   * @returns A new OptionalModifier wrapping this nullable schema
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier(this)
  }

  /**
   * Apply a transformation to the final validated value.
   * The transformer receives the validated value and can convert it to any new datatype.
   *
   * @template TransformedOutput - The type of the transformed output
   * @param transformer - Function to transform the validated value
   * @returns A new TransformModifier wrapping this schema
   *
   * @example
   * vine.string().nullable().transform((value) => {
   *   return value ? value.toUpperCase() : null
   * })
   */
  transform<TransformedOutput>(
    transformer: Transformer<this, TransformedOutput>
  ): TransformModifier<this, TransformedOutput> {
    return new TransformModifier(transformer, this)
  }

  /**
   * Compiles to compiler node
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string } {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.allowNull = true
    return output
  }
}

/**
 * Modifies a literal schema type to allow undefined values in addition to the original type.
 * This modifier is used for form fields that may not be present in submitted data.
 *
 * @template Schema - The underlying literal schema type to make optional
 *
 * @example
 * const schema = vine.string().optional()
 * // Accepts: "hello", undefined
 * // Rejects: null (unless also nullable), 123
 */
export class OptionalModifier<Schema extends ConstructableLiteralSchema<any, any, any>>
  extends ConditionalValidations
  implements
    ConstructableLiteralSchema<
      Schema[typeof ITYPE] | undefined | null,
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
  /** Camelcase output type with undefined support */
  declare [COTYPE]: Schema[typeof COTYPE] | undefined

  /** Reference to the parent schema being modified */
  #parent: Schema

  /**
   * List of additional validations to apply to non-undefined values
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
   * Shallow clones the validations. Since there are no APIs to mutate
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
   * Apply transform on the final validated value. The transform method may
   * convert the value to any new datatype.
   */
  transform<TransformedOutput>(
    transformer: Transformer<this, TransformedOutput>
  ): TransformModifier<this, TransformedOutput> {
    return new TransformModifier(transformer, this)
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
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string } {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.isOptional = true
    output.validations = output.validations.concat(this.compileValidations(refs))
    return output
  }
}

/**
 * Modifies a literal schema type to apply custom transformations to validated values.
 * This modifier allows converting validated values to any new datatype after validation.
 *
 * @template Schema - The underlying literal schema type to transform
 * @template Output - The type of the transformed output
 *
 * @example
 * const schema = vine.string().transform((value) => value.toUpperCase())
 * // Input: "hello" -> Output: "HELLO"
 */
export class TransformModifier<Schema extends ConstructableLiteralSchema<any, any, any>, Output>
  implements ConstructableLiteralSchema<Schema[typeof ITYPE], Output, Output>
{
  /**
   * Define the input type of the schema (unchanged from parent)
   */
  declare [ITYPE]: Schema[typeof ITYPE];

  /**
   * The transformed output value type.
   * The property points to a type only and not the real value.
   */
  declare [OTYPE]: Output;
  /** Camelcase transformed output type */
  declare [COTYPE]: Output

  /** Reference to the parent schema being transformed */
  #parent: Schema
  /** The transformation function to apply */
  #transform: Transformer<Schema, Output>

  /**
   * Creates a new transform modifier wrapping the given schema.
   *
   * @param transform - The transformation function to apply to validated values
   * @param parent - The schema to apply transformations to
   */
  constructor(transform: Transformer<Schema, Output>, parent: Schema) {
    this.#transform = transform
    this.#parent = parent
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the transform modifier.
   *
   * @returns A cloned instance of this transform modifier
   */
  clone(): this {
    return new TransformModifier(this.#transform, this.#parent.clone()) as this
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
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
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier(this)
  }

  /**
   * Compiles to compiler node
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string } {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.transformFnId = refs.trackTransformer(this.#transform)
    return output
  }
}

/**
 * The base type for creating a custom literal type. Literal types
 * are schema types that have no children elements, such as strings,
 * numbers, booleans, and dates.
 *
 * @template Input - The expected input type for this schema
 * @template Output - The output type after validation and transformation
 * @template CamelCaseOutput - The output type with camelCase field names
 *
 * @example
 * class CustomLiteralType extends BaseLiteralType<string, string, string> {
 *   [SUBTYPE] = 'custom'
 *   clone() { return new CustomLiteralType() }
 * }
 */
export abstract class BaseLiteralType<Input, Output, CamelCaseOutput>
  extends Macroable
  implements ConstructableLiteralSchema<Input, Output, CamelCaseOutput>, WithCustomRules
{
  /**
   * Define the input type of the schema for TypeScript inference
   */
  declare [ITYPE]: Input;

  /**
   * The output value type of the field after validation.
   * The property points to a type only and not the real value.
   */
  declare [OTYPE]: Output;
  declare [COTYPE]: CamelCaseOutput;

  /**
   * Specify the subtype of the literal schema field.
   * This is used by the compiler to identify the schema type.
   */
  abstract [SUBTYPE]: string

  /**
   * The child class must implement the clone method to create
   * a deep copy of the schema instance.
   *
   * @returns A cloned instance of this schema
   */
  abstract clone(): this

  /**
   * The validation to use for validating the schema data type.
   * Using a data type validator guards custom rules to only run when
   * the data type validation passes.
   *
   * @example
   * class StringSchema extends BaseLiteralType {
   *   dataTypeValidator = stringDataTypeRule
   * }
   */
  dataTypeValidator?: Validation<any>

  /**
   * Configuration options for this field including bail mode, nullability, and parsing
   */
  protected options: FieldOptions

  /**
   * Array of validation rules to apply to the field value
   */
  protected validations: Validation<any>[]

  /**
   * Creates a new BaseLiteralType instance with optional configuration.
   *
   * @param options - Field options like bail mode and nullability
   * @param validations - Initial set of validations to apply
   */
  constructor(options?: Partial<FieldOptions>, validations?: Validation<any>[]) {
    super()
    this.options = {
      bail: true,
      allowNull: false,
      isOptional: false,
      ...options,
    }

    this.validations = validations || []
  }

  /**
   * Shallow clones the validations. Since there are no APIs to mutate
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
   * Shallow clones the field options.
   *
   * @returns Cloned field options object
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

  /**
   * Compiles a single validation rule into a compiler validation node.
   *
   * @param validation - The validation rule to compile
   * @param refs - Reference store for tracking validation functions
   * @returns Compiled validation node
   */
  protected compileValidation(validation: Validation<any>, refs: RefsStore) {
    return {
      ruleFnId: refs.track({
        validator: validation.rule.validator,
        options: validation.options,
      }),
      name: validation.rule.name,
      implicit: validation.rule.implicit,
      isAsync: validation.rule.isAsync,
    }
  }

  /**
   * Compiles all validation rules into compiler validation nodes.
   *
   * @param refs - Reference store for tracking validation functions
   * @returns Array of compiled validation nodes
   */
  protected compileValidations(refs: RefsStore) {
    return this.validations.map((validation) => this.compileValidation(validation, refs))
  }

  /**
   * Define a method to parse the input value. The method
   * is invoked before any validation and hence you must
   * perform type-checking to know the value you are
   * working it.
   */
  parse(callback: Parser): this {
    this.options.parse = callback
    return this
  }

  /**
   * Adds a validation rule to the schema's validation chain.
   * Rules are executed in the order they are added.
   *
   * @param validation - The validation rule or rule builder to add
   * @returns This schema instance for method chaining
   *
   * @example
   * vine.string().use(minLength({ length: 3 }))
   * vine.number().use(customRule({ strict: true }))
   */
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
    return this
  }

  /**
   * Enable/disable bail mode for this field.
   * In bail mode, field validations stop after the first error.
   *
   * @param state - Whether to enable bail mode
   * @returns This schema instance for method chaining
   *
   * @example
   * vine.string().bail(false) // Continue validation after first error
   * vine.number().bail(true)  // Stop after first error (default)
   */
  bail(state: boolean) {
    this.options.bail = state
    return this
  }

  /**
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
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
   */
  nullable(): NullableModifier<this> {
    return new NullableModifier(this)
  }

  /**
   * Apply transform on the final validated value. The transform method may
   * convert the value to any new datatype.
   */
  transform<TransformedOutput>(
    transformer: Transformer<this, TransformedOutput>
  ): TransformModifier<this, TransformedOutput> {
    return new TransformModifier(transformer, this)
  }

  /**
   * Compiles the literal schema type into a compiler node.
   * This method transforms the schema definition into a format
   * that the validation compiler can process.
   *
   * @param propertyName - Name of the property being compiled
   * @param refs - Reference store for the compiler
   * @param options - Parser options including camelCase conversion
   * @returns Compiled literal node with subtype information
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string } {
    return {
      type: 'literal',
      subtype: this[SUBTYPE],
      fieldName: propertyName,
      ...(this.dataTypeValidator
        ? { dataTypeValidatorFnId: this.compileValidation(this.dataTypeValidator, refs).ruleFnId }
        : {}),
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}
