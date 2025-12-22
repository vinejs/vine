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

import type { FieldOptions, ParserOptions, ConstructableSchema } from '../../types.js'
import { OTYPE, COTYPE, PARSE, ITYPE, SUBTYPE, UNIQUE_NAME, IS_OF_TYPE } from '../../symbols.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * Specify a null value inside a union.
 */
export class VineNull implements ConstructableSchema<null, null, null> {
  /**
   * The input type of the schema
   */
  declare [ITYPE]: null;

  /**
   * The output value of the field. The property points to a type only
   * and not the real value.
   */
  declare [OTYPE]: null;
  declare [COTYPE]: null;

  /**
   * The subtype of the literal schema field
   */
  [SUBTYPE]: string = 'null';

  /**
   * The property must be implemented for "unionOfTypes"
   */
  [UNIQUE_NAME] = 'vine.null';

  /**
   * Checks if the value is null. The method must be
   * implemented for "unionOfTypes"
   */
  [IS_OF_TYPE] = (value: unknown) => {
    return value === null
  }

  /**
   * Field options
   */
  protected options: FieldOptions

  constructor(options?: Partial<FieldOptions>) {
    this.options = {
      bail: true,
      allowNull: true,
      isOptional: false,
      ...options,
    }
  }

  /**
   * Shallow clones the options
   */
  protected cloneOptions(): FieldOptions {
    return { ...this.options }
  }

  /**
   * Clones the VineNull schema type. The applied options
   * and validations are copied to the new instance
   */
  clone(): this {
    return new VineNull(this.cloneOptions()) as this
  }

  /**
   * Compiles the schema type to a compiler node
   */
  [PARSE](
    propertyName: string,
    refs: RefsStore,
    options: ParserOptions
  ): LiteralNode & { subtype: string; jsonSchema: JSONSchema7 } {
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
      jsonSchema: {
        type: 'null',
      },
    }
  }
}
