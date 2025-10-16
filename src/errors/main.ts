/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValidationError } from './validation_error.js'

/**
 * Factory constant for creating ValidationError instances.
 * This is the main export for creating validation errors in the Vine validation library.
 *
 * @example
 * throw new E_VALIDATION_ERROR(errors)
 *
 * @example
 * const error = new E_VALIDATION_ERROR({
 *   field: 'username',
 *   message: 'Username is required'
 * })
 */
export const E_VALIDATION_ERROR = ValidationError
