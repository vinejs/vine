/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessagesProviderContact, FieldContext } from './types.js'

/**
 * Default messages provider performs messages lookup inside
 * a collection of key-value pair.
 */
export class MessagesProvider implements MessagesProviderContact {
  #messages: Record<string, string> = {}

  constructor(messages: Record<string, string>) {
    this.#messages = messages
  }

  /**
   * Returns a validation message for a given field + rule. The args
   * may get defined by a validation rule to share additional context.
   */
  getMessage(rawMessage: string, rule: string, ctx: FieldContext) {
    /**
     * 1st priority is given to the field messages
     */
    const fieldMessage = this.#messages[`${ctx.wildCardPath}.${rule}`]
    if (fieldMessage) {
      return fieldMessage
    }

    /**
     * 2nd priority is for rule messages
     */
    const ruleMessage = this.#messages[rule]
    if (fieldMessage) {
      return ruleMessage
    }

    /**
     * Fallback to raw message
     */
    return rawMessage
  }
}
