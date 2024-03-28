/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelcase from 'camelcase'
import { RefsStore, RecordNode } from '@vinejs/compiler/types'

import { BaseType } from '../base/main.js'
import { ITYPE, OTYPE, COTYPE, PARSE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import type { FieldOptions, ParserOptions, SchemaTypes, Validation } from '../../types.js'
import { fixedLengthRule, maxLengthRule, minLengthRule, validateKeysRule } from './rules.js'

/**
 * VineRecord represents an object of key-value pair in which
 * keys are unknown
 */
export class VineRecord<Schema extends SchemaTypes> extends BaseType<
  { [K: string]: Schema[typeof ITYPE] },
  { [K: string]: Schema[typeof OTYPE] },
  { [K: string]: Schema[typeof COTYPE] }
> {
  /**
   * Default collection of record rules
   */
  static rules = {
    maxLength: maxLengthRule,
    minLength: minLengthRule,
    fixedLength: fixedLengthRule,
    validateKeys: validateKeysRule,
  }

  #schema: Schema;

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.object';

  /**
   * Checks if the value is of object type. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  constructor(schema: Schema, options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
    this.#schema = schema
  }

  /**
   * Enforce a minimum length on an object field
   */
  minLength(expectedLength: number) {
    return this.use(minLengthRule({ min: expectedLength }))
  }

  /**
   * Enforce a maximum length on an object field
   */
  maxLength(expectedLength: number) {
    return this.use(maxLengthRule({ max: expectedLength }))
  }

  /**
   * Enforce a fixed length on an object field
   */
  fixedLength(expectedLength: number) {
    return this.use(fixedLengthRule({ size: expectedLength }))
  }

  /**
   * Register a callback to validate the object keys
   */
  validateKeys(...args: Parameters<typeof validateKeysRule>) {
    return this.use(validateKeysRule(...args))
  }

  /**
   * Clones the VineRecord schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineRecord(
      this.#schema.clone(),
      this.cloneOptions(),
      this.cloneValidations()
    ) as this
  }

  /**
   * Compiles to record data type
   */
  [PARSE](propertyName: string, refs: RefsStore, options: ParserOptions): RecordNode {
    return {
      type: 'record',
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
