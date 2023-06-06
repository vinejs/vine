/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import type { LiteralNode, RefsStore } from '@vinejs/compiler/types'

import { BRAND, CBRAND, PARSE, VALIDATION } from '../../symbols.js'
import type {
  Parser,
  Validation,
  RuleBuilder,
  Transformer,
  FieldOptions,
  ParserOptions,
  ConstructableSchema,
} from '../../types.js'

/**
 * Base schema type with only modifiers applicable on all the schema types.
 */
abstract class BaseModifiersType<Output, CamelCaseOutput>
  implements ConstructableSchema<Output, CamelCaseOutput>
{
  /**
   * Each subtype should implement the compile method that returns
   * one of the known compiler nodes
   */
  abstract [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): LiteralNode

  /**
   * The child class must implement the clone method
   */
  abstract clone(): this

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [BRAND]: Output;
  declare [CBRAND]: CamelCaseOutput

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
}

/**
 * Modifies the schema type to allow null values
 */
class NullableModifier<Schema extends BaseModifiersType<any, any>> extends BaseModifiersType<
  Schema[typeof BRAND] | null,
  Schema[typeof CBRAND] | null
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
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
   * Compiles to compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): LiteralNode {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.allowNull = true
    return output
  }
}

/**
 * Modifies the schema type to allow undefined values
 */
class OptionalModifier<Schema extends BaseModifiersType<any, any>> extends BaseModifiersType<
  Schema[typeof BRAND] | undefined,
  Schema[typeof CBRAND] | undefined
> {
  #parent: Schema
  constructor(parent: Schema) {
    super()
    this.#parent = parent
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the optional modifier
   */
  clone(): this {
    return new OptionalModifier(this.#parent.clone()) as this
  }

  /**
   * Compiles to compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): LiteralNode {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.isOptional = true
    return output
  }
}

/**
 * Modifies the schema type to allow custom transformed values
 */
class TransformModifier<
  Schema extends BaseModifiersType<any, any>,
  Output
> extends BaseModifiersType<Output, Output> {
  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [BRAND]: Output;
  declare [CBRAND]: Output

  #parent: Schema
  #transform: Transformer<Schema, Output>

  constructor(transform: Transformer<Schema, Output>, parent: Schema) {
    super()
    this.#transform = transform
    this.#parent = parent
  }

  /**
   * Creates a fresh instance of the underlying schema type
   * and wraps it inside the transform modifier.
   */
  clone(): this {
    return new TransformModifier(this.#transform, this.#parent.clone()) as this
  }

  /**
   * Compiles to compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): LiteralNode {
    const output = this.#parent[PARSE](propertyName, refs, options)
    output.transformFnId = refs.trackTransformer(this.#transform)
    return output
  }
}

/**
 * The base type for creating a custom literal type. Literal type
 * is a schema type that has no children elements.
 */
export abstract class BaseLiteralType<Output, CamelCaseOutput> extends BaseModifiersType<
  Output,
  CamelCaseOutput
> {
  /**
   * The child class must implement the clone method
   */
  abstract clone(): this

  /**
   * Field options
   */
  protected options: FieldOptions

  /**
   * Set of validations to run
   */
  protected validations: Validation<any>[]

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
        implicit: validation.rule.implicit,
        isAsync: validation.rule.isAsync,
      }
    })
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
   * Push a validation to the validations chain.
   */
  use(validation: Validation<any> | RuleBuilder): this {
    this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation)
    return this
  }

  /**
   * Enable/disable the bail mode. In bail mode, the field validations
   * are stopped after the first error.
   */
  bail(state: boolean) {
    this.options.bail = state
    return this
  }

  /**
   * Compiles the schema type to a compiler node
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): LiteralNode {
    return {
      type: 'literal',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}
