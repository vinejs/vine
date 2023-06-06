/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessagesProviderContact, FieldContext } from '../types.js'

/**
 * Default messages provider performs messages lookup inside
 * a collection of key-value pair.
 */
export class SimpleMessagesProvider implements MessagesProviderContact {
  #messages: Record<string, string> = {}

  constructor(messages: Record<string, string>) {
    this.#messages = messages
  }

  /**
   * Interpolates place holders within error messages
   */
  #interpolate(message: string, data: any): string {
    if (!message.includes('{{')) {
      return message
    }

    return message.replace(/(\\)?{{(.*?)}}/g, (_, __, key) => {
      const tokens = key.trim().split('.')
      let output = data

      while (tokens.length) {
        if (output === null || typeof output !== 'object') {
          return
        }
        const token = tokens.shift()
        output = Object.hasOwn(output, token) ? output[token] : undefined
      }

      return output
    })
  }

  /**
   * Returns a validation message for a given field + rule.
   */
  getMessage(rawMessage: string, rule: string, ctx: FieldContext, args?: Record<string, any>) {
    /**
     * 1st priority is given to the field messages
     */
    const fieldMessage = this.#messages[`${ctx.wildCardPath}.${rule}`]
    if (fieldMessage) {
      return this.#interpolate(fieldMessage, {
        field: ctx.fieldName,
        ...args,
      })
    }

    /**
     * 2nd priority is for rule messages
     */
    const ruleMessage = this.#messages[rule]
    if (fieldMessage) {
      return this.#interpolate(ruleMessage, {
        field: ctx.fieldName,
        ...args,
      })
    }

    /**
     * Fallback to raw message
     */
    return this.#interpolate(rawMessage, {
      field: ctx.fieldName,
      ...args,
    })
  }
}
