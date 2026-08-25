/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ConditionalFn, ObjectGroupNode, RefsStore } from '@vinejs/compiler/types'

import { OTYPE, COTYPE, PARSE, ITYPE } from '../../symbols.js'
import type { ParserOptions, SchemaTypes, WithJSONSchema } from '../../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * GroupConditional represents a subset of object properties that are conditionally
 * validated and merged based on a runtime condition. This allows schemas to have
 * different required fields depending on the values in the object being validated.
 *
 * @template Properties - Record of property names to their schema types
 * @template Input - Expected input type for these properties
 * @template Output - Output type after validation and transformation
 * @template CamelCaseOutput - Output type with camelCase property names
 *
 * @example
 * vine.group.if(
 *   (value) => value.shipping_required === true,
 *   {
 *     shipping_address: vine.string(),
 *     shipping_method: vine.string()
 *   }
 * )
 */
export class GroupConditional<
  Properties extends Record<string, SchemaTypes>,
  Input,
  Output,
  CamelCaseOutput,
> implements WithJSONSchema {
  declare [ITYPE]: Input;
  declare [OTYPE]: Output;
  declare [COTYPE]: CamelCaseOutput

  /**
   * Properties to validate and merge when the conditional evaluates to true
   */
  #properties: Properties

  /**
   * Conditional function that determines whether to validate these properties
   */
  #conditional: ConditionalFn<Record<string, unknown>>

  /**
   * Creates a new GroupConditional with a condition and properties.
   *
   * @param conditional - Function that returns truthy value when properties should be validated
   * @param properties - Properties to validate and merge when condition is true
   */
  constructor(conditional: ConditionalFn<Record<string, unknown>>, properties: Properties) {
    this.#properties = properties
    this.#conditional = conditional
  }

  /**
   * Converts the conditional properties to JSON Schema format.
   *
   * @returns JSON Schema representation of this conditional's properties
   */
  toJSONSchema(): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {}
    const required: string[] = []

    for (const [key, property] of Object.entries(this.#properties)) {
      const schema = property.toJSONSchema()
      properties[key] = schema

      if (!('isOptional' in property) || property.isOptional !== true) {
        required.push(key)
      }
    }

    return {
      type: 'object',
      properties,
      required,
    }
  }

  /**
   * Compiles the conditional to a compiler node for validation.
   *
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled conditional node
   */
  [PARSE](refs: RefsStore, options: ParserOptions): ObjectGroupNode['conditions'][number] {
    return {
      schema: {
        type: 'sub_object',
        properties: Object.keys(this.#properties).map((property) => {
          return this.#properties[property][PARSE](property, refs, options)
        }),
        groups: [], // Compiler allows nested groups, but we are not implementing it
      },
      conditionalFnRefId: refs.trackConditional(this.#conditional),
    }
  }
}
