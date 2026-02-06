import { requiredWhen } from './rules.js'
import { helpers } from '../../vine/helpers.js'
import type {
  Validation,
  RuleBuilder,
  FieldContext,
  ComparisonOperators,
  ArrayComparisonOperators,
  NumericComparisonOperators,
} from '../../types.js'

/**
 * Abstract base class providing conditional validation methods for making fields
 * required based on runtime conditions. This class is extended by schema types
 * that support conditional validation.
 *
 * @example
 * vine.string().optional().requiredWhen('role', '=', 'admin')
 */
export abstract class ConditionalValidations {
  /**
   * Adds a validation rule to the schema's validation chain.
   * Must be implemented by the extending class.
   *
   * @param validation - The validation rule or rule builder to add
   */
  abstract use(validation: Validation<any> | RuleBuilder): this

  /**
   * Marks the field as required when a condition is met. Can be used with a callback
   * or with comparison operators to compare another field's value.
   *
   * @param otherField - Field name to compare or callback function
   * @param operator - Comparison operator (=, !=, in, notIn, >, <, >=, <=)
   * @param expectedValue - Expected value to compare against
   *
   * @example
   * vine.string().optional().requiredWhen('role', '=', 'admin')
   *
   * @example
   * vine.string().optional().requiredWhen('age', '>', 18)
   *
   * @example
   * vine.string().optional().requiredWhen((field) => field.data.isAdmin === true)
   */
  requiredWhen<Operator extends ComparisonOperators>(
    otherField: string,
    operator: Operator,
    expectedValue: Operator extends ArrayComparisonOperators
      ? (string | number | boolean)[]
      : Operator extends NumericComparisonOperators
        ? number
        : string | number | boolean
  ): this
  requiredWhen(callback: (field: FieldContext) => boolean): this
  requiredWhen(
    otherField: string | ((field: FieldContext) => boolean),
    operator?: ComparisonOperators,
    expectedValue?: any
  ) {
    /**
     * The equality check if self implemented
     */
    if (typeof otherField === 'function') {
      return this.use(requiredWhen(otherField))
    }

    /**
     * Creating the checker function based upon the
     * operator used for the comparison
     */
    let checker: (value: any) => boolean
    switch (operator!) {
      case '=':
        checker = (value) => value === expectedValue
        break
      case '!=':
        checker = (value) => value !== expectedValue
        break
      case 'in':
        checker = (value) => expectedValue.includes(value)
        break
      case 'notIn':
        checker = (value) => !expectedValue.includes(value)
        break
      case '>':
        checker = (value) => value > expectedValue
        break
      case '<':
        checker = (value) => value < expectedValue
        break
      case '>=':
        checker = (value) => value >= expectedValue
        break
      case '<=':
        checker = (value) => value <= expectedValue
    }

    /**
     * Registering rule with custom implementation
     */
    return this.use(
      requiredWhen((field) => {
        const otherFieldValue = helpers.getNestedValue(otherField, field)
        return checker(otherFieldValue)
      })
    )
  }

  /**
   * Marks the field as required when all specified fields exist (are not undefined or null).
   *
   * @param fields - Field name or array of field names to check for existence
   *
   * @example
   * vine.string().optional().requiredIfExists('email')
   *
   * @example
   * vine.string().optional().requiredIfExists(['firstName', 'lastName'])
   */
  requiredIfExists(fields: string | string[]) {
    const fieldsToExist = Array.isArray(fields) ? fields : [fields]
    return this.use(
      requiredWhen((field) => {
        return fieldsToExist.every((otherField) => {
          return helpers.exists(helpers.getNestedValue(otherField, field))
        })
      })
    )
  }

  /**
   * Marks the field as required when any one of the specified fields exists (is not undefined or null).
   *
   * @param fields - Array of field names to check for existence
   *
   * @example
   * vine.string().optional().requiredIfAnyExists(['email', 'phone'])
   */
  requiredIfAnyExists(fields: string[]) {
    return this.use(
      requiredWhen((field) => {
        return fields.some((otherField) =>
          helpers.exists(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }

  /**
   * Marks the field as required when all specified fields are missing (undefined or null).
   *
   * @param fields - Field name or array of field names to check for absence
   *
   * @example
   * vine.string().optional().requiredIfMissing('addressId')
   *
   * @example
   * vine.string().optional().requiredIfMissing(['street', 'city'])
   */
  requiredIfMissing(fields: string | string[]) {
    const fieldsToExist = Array.isArray(fields) ? fields : [fields]
    return this.use(
      requiredWhen((field) => {
        return fieldsToExist.every((otherField) =>
          helpers.isMissing(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }

  /**
   * Marks the field as required when any one of the specified fields is missing (undefined or null).
   *
   * @param fields - Array of field names to check for absence
   *
   * @example
   * vine.string().optional().requiredIfAnyMissing(['street', 'city', 'zipCode'])
   */
  requiredIfAnyMissing(fields: string[]) {
    return this.use(
      requiredWhen((field) => {
        return fields.some((otherField) =>
          helpers.isMissing(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }
}
