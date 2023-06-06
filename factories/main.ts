/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContextFactory } from './context.js'
import { ValidatorFactory } from './validator.js'

/**
 * Validator factory is used for unit testing validation
 * rules.
 */
export const validator = new ValidatorFactory()
export const context = new ContextFactory()
