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

import type {
  FieldOptions,
  ParserOptions,
  ConstructableSchema,
  WithJSONSchema,
} from '../../types.js'
import { OTYPE, COTYPE, PARSE, ITYPE, SUBTYPE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * VineNull represents a schema type that only accepts null values.
 * Typically used inside union types to explicitly allow null as a valid value.
 *
 * @example
 * const schema = vine.union([
 *   vine.string(),
 *   vine.null()
 * ])
 *
 * const result = await vine.validate({
 *   schema,
 *   data: null
 * })
 */
export class VineNull implements ConstructableSchema<null, null, null>, WithJSONSchema {
  /**
   * The input type of the schema (type-only property)
   */
  declare [ITYPE]: null;

  /**
   * The output type of the schema (type-only property)
   */
  declare [OTYPE]: null;

  /**
   * The camelCase output type of the schema (type-only property)
   */
  declare [COTYPE]: null;

  /**
   * The subtype identifier for the literal schema field
   */
  [SUBTYPE]: string = 'null';

  /**
   * Unique name identifier for union type resolution
   */
  [UNIQUE_NAME] = 'vine.null';

  /**
   * Type checker function to determine if a value is null.
   * Required for "unionOfTypes" functionality.
   *
   * @param value - The value to check
   * @returns True if the value is null
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value === null
  }

  /**
   * Field configuration options
   */
  protected options: FieldOptions

  /**
   * Creates a new VineNull instance with optional configuration.
   *
   * @param options - Field options like bail mode (defaults allow null)
   */
  constructor(options?: Partial<FieldOptions>) {
    this.options = {
      bail: true,
      allowNull: true,
      isOptional: false,
      ...options,
    }
  }

  /**
   * Creates a shallow clone of the field options.
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

  /**
   * Clones the VineNull schema type. The applied options
   * are copied to the new instance.
   *
   * @returns A cloned instance of this VineNull schema
   */
  clone(): this {
    return new VineNull(this.cloneOptions()) as this
  }

  /**
   * Converts the schema to JSON Schema format.
   * Returns a schema with type 'null'.
   */
  toJSONSchema(): JSONSchema7 {
    return { type: 'null' }
  }

  /**
   * Compiles the schema type to a compiler node for validation.
   *
   * @param propertyName - The name of the property being validated
   * @param refs - Reference store for tracking parsers and validators
   * @param options - Parser options including camelCase conversion
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
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: [],
    }
  }
}
