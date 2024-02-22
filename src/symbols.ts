/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The symbol to define a unique name for the schema type
 */
export const UNIQUE_NAME = Symbol.for('schema_name')

/**
 * The symbol to check if a value is of the given schema
 * type
 */
export const IS_OF_TYPE = Symbol.for('is_of_type')

/**
 * The symbol for the compile method
 */
export const PARSE = Symbol.for('parse')

/**
 * The symbol for the opaque type
 */
export const OTYPE = Symbol.for('opaque_type')

/**
 * The symbol for the camelcase opaque type
 */
export const COTYPE = Symbol.for('camelcase_opaque_type')

/**
 * The symbol to generate a validation rule from rule builder
 */
export const VALIDATION = Symbol.for('to_validation')
