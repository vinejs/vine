/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type ObjectGroupNode, type RefsStore } from '@vinejs/compiler/types'

import { messages } from '../../defaults.js'
import { type GroupConditional } from './conditional.js'
import { ITYPE, OTYPE, COTYPE, PARSE } from '../../symbols.js'
import type { ParserOptions, UnionNoMatchCallback, WithJSONSchema } from '../../types.js'
import { type JSONSchema7 } from 'json-schema'

/**
 * ObjectGroup represents a collection of conditional property sets that can be
 * merged into an object based on runtime conditions. This enables dynamic schema
 * composition where different properties are validated based on conditional logic.
 *
 * @template Conditional - The type of conditional used in this group
 *
 * @example
 * const schema = vine.object({
 *   type: vine.string()
 * }).merge(
 *   vine.group([
 *     vine.group.if((value) => value.type === 'user', {
 *       username: vine.string()
 *     }),
 *     vine.group.if((value) => value.type === 'admin', {
 *       permissions: vine.array(vine.string())
 *     })
 *   ])
 * )
 */
export class ObjectGroup<
  Conditional extends GroupConditional<any, any, any, any>,
> implements WithJSONSchema {
  declare [ITYPE]: Conditional[typeof ITYPE];
  declare [OTYPE]: Conditional[typeof OTYPE];
  declare [COTYPE]: Conditional[typeof COTYPE]

  /**
   * Array of conditional property sets to evaluate
   */
  #conditionals: Conditional[]

  /**
   * Callback invoked when no conditional matches. Defaults to reporting an error.
   */
  #otherwiseCallback: UnionNoMatchCallback<Record<string, unknown>> = (_, field) => {
    field.report(messages.unionGroup, 'unionGroup', field)
  }

  /**
   * Creates a new ObjectGroup with the specified conditionals.
   *
   * @param conditionals - Array of conditional property sets to evaluate
   */
  constructor(conditionals: Conditional[]) {
    this.#conditionals = conditionals
  }

  /**
   * Converts the object group to JSON Schema format using anyOf.
   *
   * @returns JSON Schema representation of this group
   */
  toJSONSchema(): JSONSchema7 {
    return {
      anyOf: this.#conditionals.map((conditional) => conditional.toJSONSchema()),
    }
  }

  /**
   * Clones the ObjectGroup including all conditionals and the otherwise callback.
   *
   * @returns A cloned instance of this ObjectGroup
   */
  clone(): this {
    const cloned = new ObjectGroup<Conditional>(this.#conditionals)
    cloned.otherwise(this.#otherwiseCallback)
    return cloned as this
  }

  /**
   * Defines a fallback callback to invoke when none of the group conditions match.
   * By default, this reports a validation error. Use this method to customize
   * the error handling behavior.
   *
   * @param callback - Callback to invoke when no condition matches
   * @returns This group instance for method chaining
   *
   * @example
   * vine.group([
   *   vine.group.if((value) => value.type === 'user', { username: vine.string() }),
   *   vine.group.if((value) => value.type === 'admin', { role: vine.string() })
   * ]).otherwise((value, field) => {
   *   field.report('Invalid type specified', 'invalidType', field)
   * })
   */
  otherwise(callback: UnionNoMatchCallback<Record<string, unknown>>): this {
    this.#otherwiseCallback = callback
    return this
  }

  /**
   * Compiles the group to a compiler node for validation.
   *
   * @param refs - Reference store for the compiler
   * @param options - Parser options
   * @returns Compiled object group node
   */
  [PARSE](refs: RefsStore, options: ParserOptions): ObjectGroupNode {
    return {
      type: 'group',
      elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
      conditions: this.#conditionals.map((conditional) => conditional[PARSE](refs, options)),
    }
  }
}
