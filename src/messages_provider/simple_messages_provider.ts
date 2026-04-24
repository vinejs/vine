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
 * Default messages provider that performs message lookup using key-value pairs.
 * Provides internationalization and custom error message support for validation.
 * Supports field-specific messages, wildcard patterns, and placeholder interpolation.
 *
 * @example
 * const provider = new SimpleMessagesProvider({
 *   'required': 'The {{ field }} field is required',
 *   'email': 'The {{ field }} field must be a valid email',
 *   'user.email.required': 'Email address is required'
 * }, {
 *   'user.email': 'Email Address'
 * })
 */
export class SimpleMessagesProvider implements MessagesProviderContact {
  /** Collection of validation error message templates */
  #messages: ValidationMessages
  /** Mapping of field paths to human-readable field names */
  #fields: ValidationFields

  /**
   * Creates a new SimpleMessagesProvider instance.
   *
   * @param messages - Map of validation rule names to error message templates
   * @param fields - Optional map of field paths to human-readable names
   *
   * @example
   * new SimpleMessagesProvider({
   *   'required': 'The {{ field }} field is required'
   * }, {
   *   'user_name': 'Username'
   * })
   */
  constructor(messages: ValidationMessages, fields?: ValidationFields) {
    this.#messages = messages
    this.#fields = fields || {}
  }

  /**
   * Interpolates placeholders within error messages using mustache-like syntax.
   * Supports nested property access using dot notation.
   *
   * @param message - The message template with placeholders
   * @param data - Data object containing values for interpolation
   * @returns Interpolated message string
   *
   * @example
   * interpolate('The {{ field }} must be at least {{ min }} characters', {
   *   field: 'username',
   *   min: 5
   * })
   * // Returns: "The username must be at least 5 characters"
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
   * Returns a validation error message for a given field and rule.
   * Uses a priority-based lookup system to find the most specific message.
   *
   * Priority order:
   * 1. Field-specific messages (e.g., 'user.email.required')
   * 2. Wildcard path messages (e.g., '*.email.required')
   * 3. Generic rule messages (e.g., 'required')
   * 4. Fallback to raw message
   *
   * @param rawMessage - The default raw message from the validation rule
   * @param rule - The name of the validation rule that failed
   * @param field - Context information about the field being validated
   * @param args - Additional arguments to interpolate into the message
   * @returns Formatted and interpolated error message
   *
   * @example
   * // With field-specific message
   * provider.getMessage('Required', 'required', fieldContext, {})
   * // Returns: "Email address is required" (if field-specific message exists)
   *
   * // With rule arguments
   * provider.getMessage('Min length', 'minLength', fieldContext, { min: 5 })
   * // Returns: "The username must be at least 5 characters"
   */
  getMessage(rawMessage: string, rule: string, field: FieldContext, args?: Record<string, any>) {
    const fieldName = this.#fields[field.getFieldPath()] || this.#fields[field.name] || field.name

    /**
     * 1st priority: Field-specific messages (highest specificity)
     * Example: 'user.email.required'
     */
    const fieldMessage = this.#messages[`${field.getFieldPath()}.${rule}`]
    if (fieldMessage) {
      return this.#interpolate(fieldMessage, {
        field: fieldName,
        ...args,
      })
    }

    /**
     * 2nd priority: Wildcard path messages (medium specificity)
     * Example: '*.email.required'
     */
    const wildcardMessage = this.#messages[`${field.wildCardPath}.${rule}`]
    if (wildcardMessage) {
      return this.#interpolate(wildcardMessage, {
        field: fieldName,
        ...args,
      })
    }

    /**
     * 3rd priority: Generic rule messages (low specificity)
     * Example: 'required'
     */
    const ruleMessage = this.#messages[rule]
    if (ruleMessage) {
      return this.#interpolate(ruleMessage, {
        field: fieldName,
        ...args,
      })
    }

    /**
     * Fallback: Use the raw message provided by the validation rule
     */
    return this.#interpolate(rawMessage, {
      field: fieldName,
      ...args,
    })
  }

  /**
   * Serializes the messages provider to a JSON-compatible object.
   * Useful for debugging, logging, or transferring configuration.
   *
   * @returns Object containing messages and field mappings
   *
   * @example
   * const config = provider.toJSON()
   * console.log(config)
   * // { messages: { required: "..." }, fields: { user_name: "Username" } }
   */
  toJSON() {
    return {
      messages: this.#messages,
      fields: this.#fields,
    }
  }
}
