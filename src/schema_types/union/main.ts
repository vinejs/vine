/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefsStore, UnionNode } from '@vinejs/compiler/types'

import { SchemaTypes } from '../../types.js'
import { UnionConditional } from './conditional.js'
import { BRAND, CBRAND, COMPILER } from '../../symbols.js'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnion<Conditionals extends UnionConditional<SchemaTypes>> {
  declare [BRAND]: Conditionals[typeof BRAND];
  declare [CBRAND]: Conditionals[typeof CBRAND]

  constructor(public conditionals: Conditionals[]) {}

  /**
   * Compiles to a union
   */
  [COMPILER](propertyName: string, refs: RefsStore): UnionNode {
    return {
      type: 'union',
      conditions: this.conditionals.map((conditional) => conditional[COMPILER](propertyName, refs)),
      fieldName: propertyName,
      propertyName: propertyName,
    }
  }
}
