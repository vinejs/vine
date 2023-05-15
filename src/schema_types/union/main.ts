/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RefsStore, UnionNode } from '@vinejs/compiler/types'

import { UnionConditional } from './conditional.js'
import type { SchemaTypes } from '../../types.js'

/**
 * Vine union represents a union data type. A union is a collection
 * of conditionals and each condition has an associated schema
 */
export class VineUnion<Conditionals extends UnionConditional<SchemaTypes, any, any>> {
  declare __brand: Conditionals['__brand']
  declare __camelCaseBrand: Conditionals['__camelCaseBrand']

  constructor(public conditionals: Conditionals[]) {}

  /**
   * Compiles to a union
   */
  compile(propertyName: string, refs: RefsStore): UnionNode {
    return {
      type: 'union',
      conditions: this.conditionals.map((conditional) => conditional.compile(propertyName, refs)),
      fieldName: propertyName,
      propertyName: propertyName,
    }
  }
}
