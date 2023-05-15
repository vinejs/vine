/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { VineHelpers } from './helpers.js'
import { createRule } from './create_rule.js'
import type { VineOptions } from './types.js'
import { SchemaBuilder } from './schema_builder.js'
import { MessagesProvider } from './messages_provider.js'

export class Vine extends SchemaBuilder {
  #options: VineOptions = {
    convertEmptyStringsToNull: false,
    messagesProvider: (messages) => new MessagesProvider(messages),
  }

  /**
   * Helpers to perform type-checking or cast types keeping
   * HTML forms serialization behavior in mind.
   */
  helpers = new VineHelpers()

  /**
   * Convert a validation function to a Vine schema rule
   */
  createRule = createRule

  /**
   * Configure vine. The options are applied globally and impacts
   * all the schemas
   */
  configure(options: Partial<VineOptions>) {
    Object.assign(this.#options, options)
  }
}
