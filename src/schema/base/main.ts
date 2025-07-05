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
import { JSONSchema7 } from 'json-schema'

/**
 * Modifies the schema type to allow null values
 */
export class NullableModifier<Schema extends ConstructableSchema<any, any, any>>
  implements
    ConstructableSchema<
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
   * Mark the field under validation as optional. An optional
   * field allows both null and undefined values.
   */
  optional(): OptionalModifier<this> {
    return new OptionalModifier(this)
  }

  meta(meta: JSONSchema7): MetaModifier<this> {
    return new MetaModifier(this, meta)
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
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)
    if (output.type !== 'union') {
      output.allowNull = true

      // TODO: We might want to dedupe
      if (output.json.anyOf) {
        output.json.anyOf.push({ type: 'null' })
        return output
      }

      if (output.json.type === undefined) {
        output.json.type = 'null'
        return output
      }

      if (typeof output.json.type === 'string') {
        output.json.type = [output.json.type, 'null']
        return output
      }

      if (Array.isArray(output.json.type)) {
        output.json.type.push('null')
        return output
      }
    }

    return output
  }
}

export class MetaModifier<Schema extends ConstructableSchema<any, any, any>>
  implements ConstructableSchema<Schema[typeof ITYPE], Schema[typeof OTYPE], Schema[typeof COTYPE]>
{
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
  #meta: JSONSchema7

  constructor(parent: Schema, meta: JSONSchema7) {
    this.#parent = parent
    this.#meta = meta
  }

  clone(): this {
    return new MetaModifier(this.#parent.clone(), this.#meta) as this
  }

  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes {
    const output = this.#parent[PARSE](propertyName, refs, options)

    output.json = {
      ...output.json,
      ...this.#meta,
    }

    return output
  }
}

/**
 * Modifies the schema type to allow undefined values
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
   * Define the input type of the schema
   */
  declare [ITYPE]: Schema[typeof ITYPE] | undefined | null;

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: Schema[typeof OTYPE] | undefined;
  declare [COTYPE]: Schema[typeof COTYPE] | undefined

  #parent: Schema

  /**
   * Optional modifier validations list
   */
  validations: Validation<any>[]

  constructor(parent: Schema, validations?: Validation<any>[]) {
    super()
    this.#parent = parent
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
 * The BaseSchema class abstracts the repetitive parts of creating
 * a custom schema type.
 */
export abstract class BaseType<Input, Output, CamelCaseOutput>
  extends Macroable
  implements ConstructableSchema<Input, Output, CamelCaseOutput>, WithCustomRules
{
  /**
   * Each subtype should implement the compile method that returns
   * one of the known compiler nodes
   */
  abstract [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): CompilerNodes

  /**
   * The child class must implement the clone method
   */
  abstract clone(): this

  /**
   * Define the input type of the schema
   */
  declare [ITYPE]: Input;

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: Output;
  declare [COTYPE]: CamelCaseOutput

  /**
   * Set of validations to run
   */
  protected validations: Validation<any>[]

  /**
   * Field options
   */
  protected options: FieldOptions

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

  meta(meta: JSONSchema7): MetaModifier<this> {
    return new MetaModifier(this, meta)
  }
}
