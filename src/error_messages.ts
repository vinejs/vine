/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Collection of default error messages used by VineJS core
 */
export const defaultErrorMessages = {
  'defined': 'The field must be defined',
  'required': 'The field must not be empty',
  'string': 'The value must be a string',
  'number': 'The value must be a number',
  'boolean': 'The value must be a boolean',
  'enum': 'Invalid selection. Select from pre-defined choices',
  'array.minLength': 'The field must have atleast {{ min }} items',
  'array.maxLength': 'The field must not have more than {{ max }} items',
  'array.fixedLength': 'The field must have exactly {{ size }} items',
  'notEmpty': 'The field must have one or more items',
  'distinct': 'The field has one or more duplicate items',
  'min': 'The value of field must be at least {{ min }}',
  'max': 'The value of field must not be greater than {{ max }}',
  'range': 'The value of field must be between {{ min }} and {{ max }}',
  'positive': 'The value of field must be a positive number',
  'negative': 'The value of field must be a negative number',
}
