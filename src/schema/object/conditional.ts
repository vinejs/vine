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
 * Group conditional represents a sub-set of object wrapped
 * inside a conditional
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
   * Properties to merge when conditonal is true
   */
  #properties: Properties

  /**
   * Conditional to evaluate
   */
  #conditional: ConditionalFn<Record<string, unknown>>

  constructor(conditional: ConditionalFn<Record<string, unknown>>, properties: Properties) {
    this.#properties = properties
    this.#conditional = conditional
  }

  /**
   * Transforms into JSONSchema.
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
   * Compiles to a union conditional
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
