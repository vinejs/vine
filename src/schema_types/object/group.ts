/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ObjectGroupNode, RefsStore } from '@vinejs/compiler/types'
import { GroupConditional } from './conditional.js'
import { COMPILER } from '../../symbols.js'

/**
 * Object group represents a group with multiple conditionals, where each
 * condition returns a set of object properties to merge into the
 * existing group
 */
export class ObjectGroup<Conditional extends GroupConditional<any, any, any>> {
  declare __brand: Conditional['__brand']
  declare __camelCaseBrand: Conditional['__camelCaseBrand']
  #conditionals: Conditional[]

  constructor(conditionals: Conditional[]) {
    this.#conditionals = conditionals
  }

  /**
   * Compiles to a group
   */
  [COMPILER](refs: RefsStore): ObjectGroupNode {
    return {
      type: 'group',
      conditions: this.#conditionals.map((conditional) => conditional[COMPILER](refs)),
    }
  }
}
