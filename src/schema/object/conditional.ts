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
import type { CompilerNodes, ParserOptions, SchemaTypes } from '../../types.js'
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
> {
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
  protected toJSONSchema(nodes: CompilerNodes[]) {
    const schema: JSONSchema7 & { properties: {}; required: [] } = {
      type: 'object',
      properties: {},
      required: [],
    }

    for (const node of nodes) {
      schema.properties[node.propertyName] = node.jsonSchema

      if (!('isOptional' in node) || !node.isOptional) {
        schema.required.push(node.propertyName)
      }
    }

    return schema
  }

  /**
   * Compiles to a union conditional
   */
  [PARSE](
    refs: RefsStore,
    options: ParserOptions
  ): ObjectGroupNode['conditions'][number] & { jsonSchema: JSONSchema7 } {
    const parsedProperties = Object.keys(this.#properties).map((property) => {
      return this.#properties[property][PARSE](property, refs, options)
    })

    return {
      schema: {
        type: 'sub_object',
        properties: parsedProperties,
        groups: [], // Compiler allows nested groups, but we are not implementing it
      },
      conditionalFnRefId: refs.trackConditional(this.#conditional),
      jsonSchema: this.toJSONSchema(parsedProperties),
    }
  }
}
