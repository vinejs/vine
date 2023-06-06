/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { errorMessages } from '../../defaults.js'
import { createRule } from '../../vine/create_rule.js'

export const stringRule = createRule((value, _, ctx) => {
  if (typeof value !== 'string') {
    ctx.report(errorMessages.string, 'string', ctx)
  }
})
