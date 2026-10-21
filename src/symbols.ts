/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The symbol to define a unique name for the schema type.
 * Used internally to identify schema types for union type validation.
 *
 * @example
 * class MySchema {
 *   [UNIQUE_NAME] = 'mySchema'
 * }
 */
export const UNIQUE_NAME = Symbol.for('schema_name')

/**
 * The symbol to check if a value is of the given schema type.
 * Used by union schemas to determine which schema variant matches a value.
 *
 * @example
 * class StringSchema {
 *   [IS_OF_TYPE](value: unknown) {
 *     return typeof value === 'string'
 *   }
 * }
 */
export const IS_OF_TYPE = Symbol.for('is_of_type')

/**
 * The symbol for the compile method that transforms a schema into compiler nodes.
 * This method is called during schema compilation to generate validation functions.
 *
 * @example
 * class MySchema {
 *   [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions) {
 *     return { type: 'literal', subtype: 'string' }
 *   }
 * }
 */
export const PARSE = Symbol.for('parse')

/**
 * The symbol for the opaque input type used in TypeScript type inference.
 * Represents the expected input type before validation and transformation.
 *
 * @example
 * class StringSchema {
 *   [ITYPE]: string | undefined
 * }
 */
export const ITYPE = Symbol.for('opaque_input_type')

/**
 * The symbol for the opaque output type used in TypeScript type inference.
 * Represents the validated and transformed output type.
 *
 * @example
 * class StringSchema {
 *   [OTYPE]: string
 * }
 */
export const OTYPE = Symbol.for('opaque_type')

/**
 * The symbol for the camelcase opaque output type used in TypeScript type inference.
 * Represents the output type when field names are converted to camelCase.
 *
 * @example
 * class ObjectSchema {
 *   [COTYPE]: { userName: string } // from user_name
 * }
 */
export const COTYPE = Symbol.for('camelcase_opaque_type')

/**
 * The symbol to generate a validation rule from rule builder.
 * Used by rule builders to convert themselves into validation rules.
 *
 * @example
 * class MinLengthRule {
 *   [VALIDATION]() {
 *     return { rule: minLengthRule, options: this.length }
 *   }
 * }
 */
export const VALIDATION = Symbol.for('to_validation')

/**
 * The symbol for the subtype of a literal field.
 * Used to identify the specific subtype of literal schema types (string, number, etc.).
 *
 * @example
 * class StringSchema {
 *   [SUBTYPE] = 'string'
 * }
 */
export const SUBTYPE = Symbol.for('subtype')
