/*
 * vinejs
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, ArrayNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import { OTYPE, COTYPE, PARSE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import type { FieldOptions, ParserOptions, SchemaTypes, Validation } from '../../types.js'

import {
  compactRule,
  notEmptyRule,
  distinctRule,
  minLengthRule,
  maxLengthRule,
  fixedLengthRule,
} from './rules.js'

/**
 * VineArray represents an array schema type in the validation
 * pipeline
 */
export class VineArray<Schema extends SchemaTypes> extends BaseType<
  Schema[typeof OTYPE][],
  Schema[typeof COTYPE][]
> {
  /**
   * Default collection of array rules
   */
  static rules = {
    compact: compactRule,
    notEmpty: notEmptyRule,
    distinct: distinctRule,
    minLength: minLengthRule,
    maxLength: maxLengthRule,
    fixedLength: fixedLengthRule,
  }

  #schema: Schema;

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.array';

  /**
   * Checks if the value is of array type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return Array.isArray(value)
  }

  constructor(schema: Schema, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schema = schema
  }

  /**
   * Enforce a minimum length on an array field
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum length on an array field
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce a fixed length on an array field
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Ensure the array is not empty
   */
  notEmpty() {
    return this.use(notEmptyRule())
  }

  /**
   * Ensure array elements are distinct/unique
   */
  distinct(fields?: string | string[]) {
    return this.use(distinctRule({ fields }))
  }

  /**
   * Removes empty strings, null and undefined values from the array
   */
  compact() {
    return this.use(compactRule())
  }

  /**
   * Clones the VineArray schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineArray(this.#schema.clone(), this.cloneOptions(), this.cloneValidations()) as this
  }

  /**
   * Compiles to array data type
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): ArrayNode {
    return {
      type: 'array',
      fieldName: propertyName,
      propertyName: options.toCamelCase ? camelcase(propertyName) : propertyName,
      bail: this.options.bail,
      allowNull: this.options.allowNull,
      isOptional: this.options.isOptional,
      each: this.#schema[PARSE]('*', refs, options),
      parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : undefined,
      validations: this.compileValidations(refs),
    }
  }
}
