/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  FieldContext,
  ValidationFields,
  ValidationMessages,
  MessagesProviderContact,
} from '../types.js'

/**
 * Default messages provider performs messages lookup inside
 * a collection of key-value pair.
 */
export class SimpleMessagesProvider implements MessagesProviderContact {
  #messages: ValidationMessages
  #fields: ValidationFields

  constructor(messages: ValidationMessages, fields?: ValidationFields) {
    this.#messages = messages
    this.#fields = fields || {}
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
  getMessage(rawMessage: string, rule: string, field: FieldContext, args?: Record<string, any>) {
    const fieldName = this.#fields[field.name] || field.name

    /**
     * 1st priority is given to the field messages
     */
    const fieldMessage = this.#messages[`${field.wildCardPath}.${rule}`]
    if (fieldMessage) {
      return this.#interpolate(fieldMessage, {
        field: fieldName,
        ...args,
      })
    }

    /**
     * 2nd priority is for rule messages
     */
    const ruleMessage = this.#messages[rule]
    if (ruleMessage) {
      return this.#interpolate(ruleMessage, {
        field: fieldName,
        ...args,
      })
    }

    /**
     * Fallback to raw message
     */
    return this.#interpolate(rawMessage, {
      field: fieldName,
      ...args,
    })
  }

  toJSON() {
    return {
      messages: this.#messages,
      fields: this.#fields,
    }
  }
}
